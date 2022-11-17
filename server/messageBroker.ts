type SubscriberId = number | string;
const WILDCARD = "*";
const WILDCARD_MULTI = "#";

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
}

export default class MessageBroker {
  private static topicTree: TopicTree = new TopicTree();

  private static getSubTopics(topic: string) {
    return topic.split("/");
  }

  public static subscribe(subscriber: SubscriberId, topic: string) {
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
      cur.subscribers.add(subscriber);
    }
  }

  public static unsubscribe(subscriber: SubscriberId, topic: string) {
    const subtopics = this.getSubTopics(topic);
    if (subtopics.length) {
      if (this.topicTree.heads.has(subtopics[0])) {
        let cur = this.topicTree.heads.get(subtopics[0]);
        for (let i = 1; i < subtopics.length; i++) {
          if (cur.next.has(subtopics[i])) {
            cur = cur.next.get(subtopics[i]);
          } else {
            return;
          }
        }
        cur.subscribers.delete(subscriber);
      }
    }
  }

  public static getSubscribers(topic: string) {
    // to do
  }
}
