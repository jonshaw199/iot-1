type SubscriberId = number | string;
const WILDCARD = "*";
const WILDCARD_MULTI = "#";
const SUBTOPIC_SEPARATOR = "/";

class TopicNode {
  subtopic: string;
  subscribers: Set<SubscriberId>;
  next: Map<string, TopicNode>;

  constructor(subtopic: string) {
    this.subtopic = subtopic;
    this.subscribers = new Set();
    this.next = new Map();
  }
}

class TopicTree {
  heads: Map<string, TopicNode>;

  constructor() {
    this.heads = new Map();
  }
}

export default class MessageBroker {
  private static _topicTree: TopicTree = new TopicTree();
  private static _subscriberMap = new Map<SubscriberId, Set<string>>();
  private static _topicMap = new Map<string, Set<SubscriberId>>();

  get subscriberMap() {
    return new Map(MessageBroker._subscriberMap);
  }

  get topicMap() {
    return new Map(MessageBroker._topicMap);
  }

  private static getSubTopics(topic: string) {
    return topic.split(SUBTOPIC_SEPARATOR);
  }

  public static clearTopicTree() {
    this._topicTree = new TopicTree();
  }

  public static subscribe(subscriber: SubscriberId, topic: string) {
    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      if (!this._topicTree.heads.has(subtopics[0])) {
        this._topicTree.heads.set(subtopics[0], new TopicNode(subtopics[0]));
      }
      let cur = this._topicTree.heads.get(subtopics[0]);
      for (let i = 1; i < subtopics.length; i++) {
        if (!cur.next.has(subtopics[i])) {
          cur.next.set(subtopics[i], new TopicNode(subtopics[i]));
        }
        cur = cur.next.get(subtopics[i]);
      }
      cur.subscribers.add(subscriber);
      if (!this._subscriberMap.has(subscriber)) {
        this._subscriberMap.set(subscriber, new Set());
      }
      this._subscriberMap.get(subscriber).add(topic);
      if (!this._topicMap.has(topic)) {
        this._topicMap.set(topic, new Set());
      }
      this._topicMap.get(topic).add(subscriber);
    }
  }

  public static unsubscribe(subscriber: SubscriberId, topic: string) {
    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      if (this._topicTree.heads.has(subtopics[0])) {
        let cur = this._topicTree.heads.get(subtopics[0]);
        for (let i = 1; i < subtopics.length; i++) {
          if (cur.next.has(subtopics[i])) {
            cur = cur.next.get(subtopics[i]);
          } else {
            return;
          }
        }
        cur.subscribers.delete(subscriber);
        this._subscriberMap.get(subscriber).delete(topic);
        this._topicMap.get(topic).delete(subscriber);
      }
    }
  }

  public static getSubscribers(topic: string) {
    function getSubscribersRec(
      remainingTopic: string,
      nodes: TopicNode[]
    ): Set<SubscriberId> {
      const result = new Set<SubscriberId>();
      const subtopics = MessageBroker.getSubTopics(remainingTopic);
      if (subtopics.length) {
        nodes.forEach((node) => {
          if (node.subtopic === WILDCARD || node.subtopic === subtopics[0]) {
            if (subtopics.length === 1) {
              node.subscribers.forEach((subscriber) => result.add(subscriber));
            } else {
              const next = getSubscribersRec(
                subtopics.slice(1).join(SUBTOPIC_SEPARATOR),
                [...node.next.values()]
              );
              next.forEach((subscriber) => result.add(subscriber));
            }
          } else if (node.subtopic === WILDCARD_MULTI) {
            node.subscribers.forEach((subscriber) => result.add(subscriber));
          }
        });
      }
      return result;
    }

    return getSubscribersRec(topic, [...this._topicTree.heads.values()]);
  }
}
