import { Types } from "mongoose";

import {
  MessageType,
  Packet,
  WebSocketClient,
  SubscriberClient,
  SubscriberId,
  Topic,
  PacketId,
  Subscriber,
} from "./types";
import Websocket from "./websocket";

const WILDCARD = "*";
const WILDCARD_MULTI = "#";
const SUBTOPIC_SEPARATOR = "/";
const DEFAULT_QOS = 1;

class TopicNode {
  subtopic: Topic;
  subscribers: Map<SubscriberId, Subscriber>;
  next: Map<Topic, TopicNode>;

  constructor(subtopic: Topic) {
    this.subtopic = subtopic;
    this.subscribers = new Map();
    this.next = new Map();
  }
}

class TopicTree {
  head: TopicNode;

  constructor() {
    this.head = new TopicNode("");
  }
}

export default class MQTT {
  private static topicTree: TopicTree = new TopicTree();
  private static subscriberMap: Map<
    SubscriberId,
    {
      unackedPackets: Map<PacketId, Packet>;
    }
  >;

  private static getSubTopics(topic: Topic) {
    return topic.split(SUBTOPIC_SEPARATOR);
  }

  public static clearTopicTree() {
    this.topicTree = new TopicTree();
    this.subscriberMap = new Map();
  }

  public static init() {
    this.subscriberMap = new Map();
  }

  public static getSubscribers(topic: Topic) {
    function getMaxQos(map: Map<SubscriberId, Subscriber>, cur: Subscriber) {
      const lastQos = map.get(cur.subscriberId)?.qos;
      // falsy woes
      const lastQosWithDefault = lastQos == null ? 0 : lastQos;
      const curQosWithDefault = cur.qos == null ? DEFAULT_QOS : cur.qos;
      return Math.max(lastQosWithDefault, curQosWithDefault);
    }
    function getSubscribersRec(
      remainingTopic: Topic,
      nodes: TopicNode[]
    ): Map<SubscriberId, Subscriber> {
      const result = new Map<SubscriberId, Subscriber>();
      const subtopics = MQTT.getSubTopics(remainingTopic);
      if (subtopics.length) {
        nodes.forEach((node) => {
          if (node.subtopic === WILDCARD || node.subtopic === subtopics[0]) {
            if (subtopics.length === 1) {
              node.subscribers.forEach((i) => {
                result.set(i.subscriberId, { ...i, qos: getMaxQos(result, i) });
              });
            } else {
              const next = getSubscribersRec(
                subtopics.slice(1).join(SUBTOPIC_SEPARATOR),
                [...node.next.values()]
              );
              next.forEach((i) =>
                result.set(i.subscriberId, { ...i, qos: getMaxQos(result, i) })
              );
            }
          } else if (node.subtopic === WILDCARD_MULTI) {
            node.subscribers.forEach((i) =>
              result.set(i.subscriberId, { ...i, qos: getMaxQos(result, i) })
            );
          }
        });
      }
      return result;
    }

    return getSubscribersRec(topic, [...this.topicTree.head.next.values()]);
  }

  private static getOrCreate(subscriberId: SubscriberId) {
    if (!this.subscriberMap.has(subscriberId)) {
      this.subscriberMap.set(subscriberId, { unackedPackets: new Map() });
    }
    return this.subscriberMap.get(subscriberId);
  }

  public static getSubscriberClients({
    topic,
    clients,
  }: {
    topic?: Topic;
    clients: WebSocketClient[];
  }) {
    const subscribers = this.getSubscribers(topic);
    return clients.reduce((arr: SubscriberClient[], cur) => {
      if (!topic || subscribers.has(cur.device._id.toString())) {
        const subscriberClient = cur as SubscriberClient;
        const subscriber = subscribers.get(cur.device._id.toString());
        if (subscriber) {
          subscriberClient.topic = subscriber.topic;
          subscriberClient.qos = subscriber.qos;
          arr.push(subscriberClient);
        }
      }
      return arr;
    }, []);
  }

  public static subscribe(packet: Packet, client?: WebSocketClient) {
    const { senderId, topic, qos } = packet;
    console.log(
      `Subscribe device ID: ${senderId}; topic: ${topic}; qos: ${qos}`
    );

    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      let cur = this.topicTree.head;
      for (let i = 0; i < subtopics.length; i++) {
        if (!cur.next.has(subtopics[i])) {
          cur.next.set(subtopics[i], new TopicNode(subtopics[i]));
        }
        cur = cur.next.get(subtopics[i]);
      }
      cur.subscribers.set(senderId, { subscriberId: senderId, topic, qos });

      if (!this.subscriberMap) {
        this.subscriberMap = new Map();
      }
      if (!this.subscriberMap.has(senderId)) {
        const unackedPackets = new Map<PacketId, Packet>();
        this.subscriberMap.set(senderId, { unackedPackets });
      }
      const res = packet;
      res.type = MessageType.TYPE_MQTT_SUBACK;
      client?.send(JSON.stringify(res));
    }
  }

  public static unsubscribe(packet: Packet, client?: WebSocketClient) {
    const { senderId, topic } = packet;
    console.log(`Unsubscribe device ID: ${senderId}; topic: ${topic}`);

    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      let cur = this.topicTree.head;
      for (let i = 0; i < subtopics.length; i++) {
        if (cur.next.has(subtopics[i])) {
          cur = cur.next.get(subtopics[i]);
        } else {
          return;
        }
      }
      cur.subscribers.delete(senderId);

      const res = packet;
      res.type = MessageType.TYPE_MQTT_UNSUBACK;
      client?.send(JSON.stringify(res));
    }
  }

  private static pubAck(packet: Packet) {
    const { packetId, senderId } = packet;
    if (packetId != null) {
      this.getOrCreate(senderId).unackedPackets.delete(packetId);
    }
  }

  private static pubRec(packet: Packet, client?: WebSocketClient) {
    const { packetId, senderId } = packet;
    if (packetId != null) {
      this.getOrCreate(senderId).unackedPackets.set(packetId, packet);
    }
    const res = packet;
    res.type = MessageType.TYPE_MQTT_PUBREL;
    client?.send(JSON.stringify(res));
  }

  private static pubRel(packet: Packet, client?: WebSocketClient) {
    const { packetId, senderId } = packet;
    if (packetId != null) {
      this.getOrCreate(senderId).unackedPackets.delete(packetId);
    }
    const res = packet;
    res.type = MessageType.TYPE_MQTT_PUBCOMP;
    client?.send(JSON.stringify(res));
  }

  private static pubComp(packet: Packet) {
    const { packetId, senderId } = packet;
    if (packetId != null) {
      this.getOrCreate(senderId).unackedPackets.delete(packetId);
    }
  }

  private static publish({
    clients,
    packet,
    senderClient,
  }: {
    clients: WebSocketClient[];
    packet: Packet;
    senderClient?: WebSocketClient;
  }) {
    const { topic, qos, packetId, senderId } = packet;
    console.log(`Publish topic ${topic}`);
    const qosInternal = qos == null ? DEFAULT_QOS : qos;
    const subscriberClients = this.getSubscriberClients({
      topic: topic,
      clients,
    });
    subscriberClients.forEach((subscriber) => {
      // Subscriber can downgrade
      const minQos =
        subscriber.qos < qosInternal ? subscriber.qos : qosInternal;
      if (minQos > 0 && packetId != null) {
        this.getOrCreate(subscriber.device._id.toString()).unackedPackets.set(
          packetId,
          { ...packet, qos: minQos }
        );
        subscriber.send(JSON.stringify({ ...packet, qos: minQos }));
      } else {
        subscriber.send(JSON.stringify({ ...packet, qos: 0 }));
      }
    });

    // QOS for publisher
    if (qosInternal) {
      let res = packet;
      switch (qosInternal) {
        case 1:
          res.type = MessageType.TYPE_MQTT_PUBACK;
          senderClient?.send(JSON.stringify(res));
          break;
        case 2:
          if (packetId != null) {
            this.getOrCreate(senderId).unackedPackets.set(packetId, packet);
          }
          res.type = MessageType.TYPE_MQTT_PUBREC;
          senderClient?.send(JSON.stringify(res));
          break;
      }
    }
  }

  public static handlePacket({
    packet,
    clients,
    senderClient,
  }: {
    packet: Packet;
    clients: WebSocketClient[];
    senderClient?: WebSocketClient;
  }) {
    switch (packet.type) {
      case MessageType.TYPE_MQTT_SUBSCRIBE:
        this.subscribe(packet, senderClient);
        break;
      case MessageType.TYPE_MQTT_UNSUBSCRIBE:
        this.unsubscribe(packet, senderClient);
        break;
      case MessageType.TYPE_MQTT_PUBLISH:
        this.publish({
          clients,
          packet,
          senderClient,
        });
        break;
      case MessageType.TYPE_MQTT_PUBACK:
        this.pubAck(packet);
        break;
      case MessageType.TYPE_MQTT_PUBREC:
        this.pubRec(packet, senderClient);
        break;
      case MessageType.TYPE_MQTT_PUBREL:
        this.pubRel(packet, senderClient);
        break;
      case MessageType.TYPE_MQTT_PUBCOMP:
        this.pubComp(packet);
        break;
      default:
        console.log(`Unknown packet type (${packet.type})`);
    }
  }
}
