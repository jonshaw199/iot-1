import { expect, test } from "@jest/globals";
import { Types } from "mongoose";

import MessageBroker from "./messageBroker";
import { MessageType, Packet } from "./types";

const sub: Packet = {
  senderId: new Types.ObjectId(),
  topic: "home/lights",
  type: MessageType.TYPE_MQTT_SUBSCRIBE,
};

test("subscribe", () => {
  MessageBroker.subscribe(sub);
  expect(MessageBroker.getSubscriberIds("home/lights").size).toBe(1);
  MessageBroker.clearTopicTree();
});

test("unsubscribe", () => {
  MessageBroker.subscribe(sub);
  MessageBroker.unsubscribe({
    ...sub,
    type: MessageType.TYPE_MQTT_UNSUBSCRIBE,
  });
  expect(MessageBroker.getSubscriberIds("home/lights").size).toBe(0);
  MessageBroker.clearTopicTree();
});

test("wildcard", () => {
  MessageBroker.subscribe({ ...sub, topic: "home/*" });
  expect(MessageBroker.getSubscriberIds("home/lights").size).toBe(1);
  MessageBroker.clearTopicTree();
});

test("wildcard-multi", () => {
  MessageBroker.subscribe({ ...sub, topic: "home/#" });
  expect(MessageBroker.getSubscriberIds("home/lights/kitchen").size).toBe(1);
  MessageBroker.clearTopicTree();
});
