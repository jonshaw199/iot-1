import { Topic, SubscriberId, Subscriber, QOS } from "./types";

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

  private static getSubTopics(topic: Topic) {
    return topic.split(SUBTOPIC_SEPARATOR);
  }

  public static clearTopicTree() {
    this.topicTree = new TopicTree();
  }

  public static subscribe(
    subscriberId: SubscriberId,
    topic: Topic,
    qos: QOS = DEFAULT_QOS
  ) {
    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      let cur = this.topicTree.head;
      for (let i = 0; i < subtopics.length; i++) {
        if (!cur.next.has(subtopics[i])) {
          cur.next.set(subtopics[i], new TopicNode(subtopics[i]));
        }
        cur = cur.next.get(subtopics[i]);
      }
      cur.subscribers.set(subscriberId, { subscriberId, topic, qos });
      return true;
    }
    return false;
  }

  public static unsubscribe(subscriberId: SubscriberId, topic: Topic) {
    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      let cur = this.topicTree.head;
      for (let i = 0; i < subtopics.length; i++) {
        if (cur.next.has(subtopics[i])) {
          cur = cur.next.get(subtopics[i]);
        } else {
          return false;
        }
      }
      cur.subscribers.delete(subscriberId);
      return true;
    }
    return false;
  }

  public static getSubscribers(topic: Topic) {
    function getMaxQos(map: Map<SubscriberId, Subscriber>, cur: Subscriber) {
      const lastQos = map.get(cur.subscriberId)?.qos;
      // 0 = falsy woes
      if (lastQos == null && cur.qos == null) {
        return DEFAULT_QOS;
      } else if (lastQos == null) {
        return cur.qos;
      } else if (cur.qos == null) {
        return lastQos;
      } else {
        return Math.max(lastQos, cur.qos);
      }
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
}
