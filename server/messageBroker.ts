import { Instance } from "express-ws";
import { Types } from "mongoose";

import {
  MessageType,
  TopicMessage,
  WebSocket,
  QOS,
  SubscriberId,
  Topic,
} from "./types";
import MQTT from "./mqtt";
import messageModel from "./models/message";

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
    msg,
  }: {
    orgId?: Types.ObjectId;
    msg: TopicMessage;
  }) {
    this.getSubscriberClients({ topic: msg.topic, orgId }).forEach(
      (subscriber) => subscriber.send(JSON.stringify(msg))
    );
  }

  public static handleMQTTMsg({
    orgId,
    msg,
  }: {
    orgId?: Types.ObjectId;
    msg: TopicMessage;
  }) {
    messageModel.create(
      {
        senderId: msg.senderId,
        state: msg.state,
        type: msg.type,
      },
      (err, m) => {
        if (err) {
          console.log(`Error creating message: ${err}`);
        }
      }
    );

    switch (msg.type) {
      case MessageType.TYPE_MQTT_SUBSCRIBE:
        const subscribeMsg = msg as TopicMessage;
        console.log(
          `Subscribe device ID: ${msg.senderId}; topic: ${subscribeMsg.topic}; qos: ${subscribeMsg.qos}`
        );
        this.subscribe(msg.senderId, subscribeMsg.topic, subscribeMsg.qos);
        break;
      case MessageType.TYPE_MQTT_UNSUBSCRIBE:
        const unsubscribeMsg = msg as TopicMessage;
        console.log(
          `Unsubscribe device ID: ${msg.senderId}; topic: ${unsubscribeMsg.topic}`
        );
        this.unsubscribe(msg.senderId, unsubscribeMsg.topic);
        break;
      case MessageType.TYPE_MQTT_PUBLISH:
        const publishMsg = msg as TopicMessage;
        console.log(`Publish topic ${publishMsg.topic}`);
        this.publish({
          orgId,
          msg: publishMsg,
        });
        break;
    }
  }
}
