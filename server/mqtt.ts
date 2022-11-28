import { Topic, SubscriberId, QOS } from "./types";

const WILDCARD = "*";
const WILDCARD_MULTI = "#";
const SUBTOPIC_SEPARATOR = "/";

class TopicNode {
  subtopic: Topic;
  subscriberIds: Set<SubscriberId>;
  next: Map<Topic, TopicNode>;

  constructor(subtopic: Topic) {
    this.subtopic = subtopic;
    this.subscriberIds = new Set();
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
    qos: QOS = 0
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
      cur.subscriberIds.add(subscriberId);
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
      cur.subscriberIds.delete(subscriberId);
      return true;
    }
    return false;
  }

  public static getSubscriberIds(topic: Topic) {
    function getSubscribersRec(
      remainingTopic: Topic,
      nodes: TopicNode[]
    ): Set<SubscriberId> {
      const result = new Set<SubscriberId>();
      const subtopics = MQTT.getSubTopics(remainingTopic);
      if (subtopics.length) {
        nodes.forEach((node) => {
          if (node.subtopic === WILDCARD || node.subtopic === subtopics[0]) {
            if (subtopics.length === 1) {
              node.subscriberIds.forEach((i) => result.add(i));
            } else {
              const next = getSubscribersRec(
                subtopics.slice(1).join(SUBTOPIC_SEPARATOR),
                [...node.next.values()]
              );
              next.forEach((i) => result.add(i));
            }
          } else if (node.subtopic === WILDCARD_MULTI) {
            node.subscriberIds.forEach((i) => result.add(i));
          }
        });
      }
      return result;
    }

    return getSubscribersRec(topic, [...this.topicTree.head.next.values()]);
  }
}
