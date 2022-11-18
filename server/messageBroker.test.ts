import { expect, test } from "@jest/globals";

import MessageBroker from "./messageBroker";

test("subscribe", () => {
  MessageBroker.subscribe(1, "home/lights");
  expect(MessageBroker.getSubscribers("home/lights").size).toBe(1);
  MessageBroker.clearTopicTree();
});

test("unsubscribe", () => {
  MessageBroker.subscribe(1, "home/lights");
  MessageBroker.unsubscribe(1, "home/lights");
  expect(MessageBroker.getSubscribers("home/lights").size).toBe(0);
  MessageBroker.clearTopicTree();
});

test("wildcard", () => {
  MessageBroker.subscribe(1, "home/*");
  expect(MessageBroker.getSubscribers("home/lights").size).toBe(1);
  MessageBroker.clearTopicTree();
});

test("wildcard-multi", () => {
  MessageBroker.subscribe(1, "home/#");
  expect(MessageBroker.getSubscribers("home/lights/kitchen").size).toBe(1);
  MessageBroker.clearTopicTree();
});
