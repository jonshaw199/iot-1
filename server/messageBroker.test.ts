import { expect, test } from "@jest/globals";

import MessageBroker from "./messageBroker";

test("subscribe", () => {
  MessageBroker.subscribe(1, "home/lights");
  expect(MessageBroker.getSubscriberIDs("home/lights").size).toBe(1);
  MessageBroker.clearTopicTree();
});

test("unsubscribe", () => {
  MessageBroker.subscribe(1, "home/lights");
  MessageBroker.unsubscribe(1, "home/lights");
  expect(MessageBroker.getSubscriberIDs("home/lights").size).toBe(0);
  MessageBroker.clearTopicTree();
});

test("wildcard", () => {
  MessageBroker.subscribe(1, "home/*");
  expect(MessageBroker.getSubscriberIDs("home/lights").size).toBe(1);
  MessageBroker.clearTopicTree();
});

test("wildcard-multi", () => {
  MessageBroker.subscribe(1, "home/#");
  expect(MessageBroker.getSubscriberIDs("home/lights/kitchen").size).toBe(1);
  MessageBroker.clearTopicTree();
});

test("all", () => {
  MessageBroker.subscribe(1, "home/#");
  MessageBroker.subscribe(1, "office/alarm/*");
  MessageBroker.subscribe(2, "home/#");
  MessageBroker.subscribe(3, "*");
  MessageBroker.unsubscribe(3, "*");
  expect(MessageBroker.getSubscriberIDs("home/lights").size).toBe(2);
  expect(MessageBroker.getSubscriberIDs("office/alarm/front-door").size).toBe(
    1
  );
  expect(MessageBroker.getSubscriberIDs("home/lights").size).toBe(2);
  MessageBroker.clearTopicTree();
});
