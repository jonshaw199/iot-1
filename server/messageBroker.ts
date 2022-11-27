import { Instance } from "express-ws";
import { Types } from "mongoose";

import {
  MessageType,
  Packet,
  WebSocket,
  QOS,
  SubscriberId,
  Topic,
} from "./types";
import MQTT from "./mqtt";

export default class MessageBroker {
  private static expressWsInstance: Instance;

  public static init(i: Instance) {
    this.expressWsInstance = i;
  }

  public static subscribe(subscriberId: SubscriberId, topic: Topic, qos?: QOS) {
    MQTT.subscribe(subscriberId, topic, qos);
  }

  public static unsubscribe(subscriberId: SubscriberId, topic: Topic) {
    MQTT.unsubscribe(subscriberId, topic);
  }

  public static getSubscribers(topic: Topic) {
    return MQTT.getSubscribers(topic);
  }

  public static clearTopicTree() {
    MQTT.clearTopicTree();
  }

  public static getSubscriberClients({
    topic,
    orgId,
  }: {
    topic?: Topic;
    orgId?: Types.ObjectId;
  }) {
    const subscribers = this.getSubscribers(topic);
    return Array.from(this.expressWsInstance.getWss().clients).filter(
      (w: WebSocket) =>
        (!topic || subscribers.has(w.deviceId.toString())) &&
        (!orgId || w.orgId.equals(orgId))
    );
  }

  private static publish({
    orgId,
    packet,
  }: {
    orgId?: Types.ObjectId;
    packet: Packet;
  }) {
    this.getSubscriberClients({ topic: packet.topic, orgId }).forEach(
      (subscriber) => subscriber.send(JSON.stringify(packet))
    );
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
        console.log(
          `Subscribe device ID: ${packet.senderId}; topic: ${packet.topic}; qos: ${packet.qos}`
        );
        this.subscribe(packet.senderId, packet.topic, packet.qos);
        break;
      case MessageType.TYPE_MQTT_UNSUBSCRIBE:
        console.log(
          `Unsubscribe device ID: ${packet.senderId}; topic: ${packet.topic}`
        );
        this.unsubscribe(packet.senderId, packet.topic);
        break;
      case MessageType.TYPE_MQTT_PUBLISH:
        console.log(`Publish topic ${packet.topic}`);
        this.publish({
          orgId,
          packet,
        });
        break;
    }
  }
}
