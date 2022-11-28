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
    return this.getOrgClients(orgId).filter(
      (w: WebSocket) => !topic || subscribers.has(w.deviceId.toString())
    );
  }

  public static getSubscriberClient(subscriberId: SubscriberId) {
    return this.getOrgClients().find((w) => w.deviceId === subscriberId);
  }

  private static subAck(packet: Packet) {
    const res = packet;
    res.type = MessageType.TYPE_MQTT_SUBACK;
    this.getSubscriberClient(packet.senderId)?.send(JSON.stringify(res));
  }

  public static subscribe(packet: Packet) {
    const { senderId, topic, qos, packetId } = packet;
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
      this.subAck(packet);
    }
  }

  private static unsubAck(packet: Packet) {
    const res = packet;
    res.type = MessageType.TYPE_MQTT_UNSUBACK;
    this.getSubscriberClient(packet.senderId)?.send(JSON.stringify(res));
  }

  public static unsubscribe(packet: Packet) {
    const { senderId, topic } = packet;
    console.log(`Unsubscribe device ID: ${senderId}; topic: ${topic}`);
    if (MQTT.unsubscribe(senderId, topic)) {
      this.subscriberMap.get(senderId).subscriptions.delete(topic);
      this.unsubAck(packet);
    }
  }

  public static clearTopicTree() {
    MQTT.clearTopicTree();
    this.subscriberMap = new Map();
  }

  private static publish({
    orgId,
    packet,
  }: {
    orgId?: Types.ObjectId;
    packet: Packet;
  }) {
    const { topic, qos, packetId } = packet;
    console.log(`Publish topic ${topic}`);
    this.getSubscriberClients({ topic: topic, orgId }).forEach((subscriber) => {
      subscriber.send(JSON.stringify(packet));
      const subscriptionQos = this.subscriberMap
        .get(subscriber.deviceId)
        .subscriptions.get(topic).qos;
      const minQos = Math.min(qos, subscriptionQos);
      if (minQos && packetId) {
        // to do, only do this for certain packet types like subscribe and publish?
        this.subscriberMap
          .get(subscriber.deviceId)
          .unackedPackets.set(packetId, packet);
      }
    });
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
    }
  }
}
