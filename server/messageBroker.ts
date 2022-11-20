import { Instance } from "express-ws";
import { WebSocket } from "./types";

import MQTT, { SubscriberId } from "./mqtt";
import { Types } from "mongoose";

export default class MessageBroker {
  private static expressWsInstance: Instance;

  public static init(i: Instance) {
    this.expressWsInstance = i;
  }

  public static subscribe(subscriber: SubscriberId, topic: string) {
    MQTT.subscribe(subscriber, topic);
  }

  public static unsubscribe(subscriber: SubscriberId, topic: string) {
    MQTT.unsubscribe(subscriber, topic);
  }

  public static getSubscriberIDs(topic: string) {
    return MQTT.getSubscriberIDs(topic);
  }

  public static clearTopicTree() {
    MQTT.clearTopicTree();
  }

  public static getSubscribers({
    topic,
    orgId,
  }: {
    topic?: string;
    orgId?: Types.ObjectId;
  }) {
    const subscribers = this.getSubscriberIDs(topic);
    return Array.from(this.expressWsInstance.getWss().clients).filter(
      (w: WebSocket) =>
        (!topic || subscribers.has(w.deviceId)) && (!orgId || w.orgId == orgId)
    );
  }
}
