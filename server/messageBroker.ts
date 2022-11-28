import { Instance } from "express-ws";
import { Types } from "mongoose";

import {
  MessageType,
  Packet,
  WebSocket,
  QOS,
  SubscriberId,
  Topic,
  PacketId,
  Subscription,
} from "./types";
import MQTT from "./mqtt";

const DEFAULT_QOS = 1;

export default class MessageBroker {
  private static expressWsInstance: Instance;
  private static subscriberMap: Map<
    SubscriberId,
    {
      unackedPackets: Map<PacketId, Packet>;
      subscriptions: Map<Topic, Subscription>;
    }
  >;

  public static init(i: Instance) {
    this.expressWsInstance = i;
  }

  public static getSubscriberIds(topic: Topic) {
    return MQTT.getSubscriberIds(topic);
  }

  private static getOrgClients(orgId?: Types.ObjectId) {
    return Array.from(
      (this.expressWsInstance?.getWss().clients as Set<WebSocket>) || []
    ).filter((w: WebSocket) => !orgId || w.orgId.equals(orgId));
  }

  public static getSubscriberClients({
    topic,
    orgId,
  }: {
    topic?: Topic;
    orgId?: Types.ObjectId;
  }) {
    const subscribers = this.getSubscriberIds(topic);
    const subscriberStrs = new Set<string>();
    subscribers.forEach((s) => subscriberStrs.add(s.toString()));
    return this.getOrgClients(orgId).filter(
      (w: WebSocket) => !topic || subscriberStrs.has(w.deviceId.toString())
    );
  }

  public static getSubscriberClient(subscriberId: SubscriberId) {
    return this.getOrgClients().find((w) => w.deviceId.equals(subscriberId));
  }

  public static subscribe(packet: Packet) {
    const { senderId, topic, qos } = packet;
    console.log(
      `Subscribe device ID: ${senderId}; topic: ${topic}; qos: ${qos}`
    );
    if (MQTT.subscribe(senderId, topic, qos)) {
      if (!this.subscriberMap) {
        this.subscriberMap = new Map();
      }
      if (!this.subscriberMap.has(senderId)) {
        const unackedPackets = new Map<PacketId, Packet>();
        const subscriptions = new Map<Topic, Subscription>();
        this.subscriberMap.set(senderId, { unackedPackets, subscriptions });
      }
      this.subscriberMap.get(senderId).subscriptions.set(topic, { topic, qos });
      const res = packet;
      res.type = MessageType.TYPE_MQTT_SUBACK;
      this.getSubscriberClient(packet.senderId)?.send(JSON.stringify(res));
    }
  }

  public static unsubscribe(packet: Packet) {
    const { senderId, topic } = packet;
    console.log(`Unsubscribe device ID: ${senderId}; topic: ${topic}`);
    if (MQTT.unsubscribe(senderId, topic)) {
      this.subscriberMap.get(senderId).subscriptions.delete(topic);
      const res = packet;
      res.type = MessageType.TYPE_MQTT_UNSUBACK;
      this.getSubscriberClient(packet.senderId)?.send(JSON.stringify(res));
    }
  }

  public static clearTopicTree() {
    MQTT.clearTopicTree();
    this.subscriberMap = new Map();
  }

  private static pubRel(packet: Packet) {
    const { packetId, senderId } = packet;
    if (packetId) {
      this.subscriberMap.get(senderId).unackedPackets.delete(packetId);
    }
    const res = packet;
    res.type = MessageType.TYPE_MQTT_PUBCOMP;
    this.getSubscriberClient(senderId)?.send(JSON.stringify(res));
  }

  private static publish({
    orgId,
    packet,
  }: {
    orgId?: Types.ObjectId;
    packet: Packet;
  }) {
    const { topic, qos, packetId, senderId } = packet;
    console.log(`Publish topic ${topic}`);
    const qosInternal = qos == null ? DEFAULT_QOS : qos;
    const clients = this.getSubscriberClients({ topic: topic, orgId });
    clients.forEach((subscriber) => {
      subscriber.send(JSON.stringify(packet));
      const subscriberQos = this.subscriberMap
        .get(subscriber.deviceId)
        .subscriptions.get(topic).qos;
      const subscriberQosInternal =
        subscriberQos == null ? DEFAULT_QOS : subscriberQos;
      const minQos = Math.min(qosInternal, subscriberQosInternal);
      if (minQos === 2 && packetId) {
        this.subscriberMap.get(senderId).unackedPackets.set(packetId, packet);
      }
    });

    if (qosInternal) {
      let res = packet;
      switch (qosInternal) {
        case 1:
          res.type = MessageType.TYPE_MQTT_PUBACK;
          this.getSubscriberClient(packet.senderId)?.send(JSON.stringify(res));
          break;
        case 2:
          const { packetId, senderId } = packet;
          if (packetId) {
            this.subscriberMap
              .get(senderId)
              .unackedPackets.set(packetId, packet);
          }
          res.type = MessageType.TYPE_MQTT_PUBREC;
          this.getSubscriberClient(senderId)?.send(JSON.stringify(res));
          break;
      }
    }
  }

  public static handlePacket({
    orgId,
    packet,
  }: {
    orgId?: Types.ObjectId;
    packet: Packet;
  }) {
    switch (packet.type) {
      case MessageType.TYPE_MQTT_SUBSCRIBE:
        this.subscribe(packet);
        break;
      case MessageType.TYPE_MQTT_UNSUBSCRIBE:
        this.unsubscribe(packet);
        break;
      case MessageType.TYPE_MQTT_PUBLISH:
        this.publish({
          orgId,
          packet,
        });
        break;
      case MessageType.TYPE_MQTT_PUBREL:
        this.pubRel(packet);
        break;
      default:
        console.log("Unknown packet type");
    }
  }
}
