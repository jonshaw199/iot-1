import { Topic, SubscriberId, Subscriber, QOS } from "./types";

const WILDCARD = "*";
const WILDCARD_MULTI = "#";
const SUBTOPIC_SEPARATOR = "/";

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
  heads: Map<Topic, TopicNode>;

  constructor() {
    this.heads = new Map();
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
    qos: QOS = 0
  ) {
    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      if (!this.topicTree.heads.has(subtopics[0])) {
        this.topicTree.heads.set(subtopics[0], new TopicNode(subtopics[0]));
      }
      let cur = this.topicTree.heads.get(subtopics[0]);
      for (let i = 1; i < subtopics.length; i++) {
        if (!cur.next.has(subtopics[i])) {
          cur.next.set(subtopics[i], new TopicNode(subtopics[i]));
        }
        cur = cur.next.get(subtopics[i]);
      }
      cur.subscribers.set(subscriberId, { id: subscriberId, qos });
      return true;
    }
    return false;
  }

  public static unsubscribe(subscriberId: SubscriberId, topic: Topic) {
    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      if (this.topicTree.heads.has(subtopics[0])) {
        let cur = this.topicTree.heads.get(subtopics[0]);
        for (let i = 1; i < subtopics.length; i++) {
          if (cur.next.has(subtopics[i])) {
            cur = cur.next.get(subtopics[i]);
          } else {
            return false;
          }
        }
        cur.subscribers.delete(subscriberId);
        return true;
      }
    }
    return false;
  }

  public static getSubscribers(topic: Topic) {
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
              node.subscribers.forEach((subscriber) =>
                result.set(subscriber.id, subscriber)
              );
            } else {
              const next = getSubscribersRec(
                subtopics.slice(1).join(SUBTOPIC_SEPARATOR),
                [...node.next.values()]
              );
              next.forEach((subscriber) =>
                result.set(subscriber.id, subscriber)
              );
            }
          } else if (node.subtopic === WILDCARD_MULTI) {
            node.subscribers.forEach((subscriber) =>
              result.set(subscriber.id, subscriber)
            );
          }
        });
      }
      return result;
    }

    return getSubscribersRec(topic, [...this.topicTree.heads.values()]);
  }
}
