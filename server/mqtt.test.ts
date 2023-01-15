import { expect, test } from "@jest/globals";

import MQTT from "./mqtt";
import { MessageType, Packet } from "./types";

const sub: Packet = {
  senderId: "",
  topic: "home/lights",
  type: MessageType.TYPE_MQTT_SUBSCRIBE,
};

test("subscribe", () => {
  MQTT.subscribe(sub);
  expect(MQTT.getSubscribers("home/lights").size).toBe(1);
  MQTT.clearTopicTree();
});

test("unsubscribe", () => {
  MQTT.subscribe(sub);
  MQTT.unsubscribe({
    ...sub,
    type: MessageType.TYPE_MQTT_UNSUBSCRIBE,
  });
  expect(MQTT.getSubscribers("home/lights").size).toBe(0);
  MQTT.clearTopicTree();
});

test("wildcard", () => {
  MQTT.subscribe({ ...sub, topic: "home/*" });
  expect(MQTT.getSubscribers("home/lights").size).toBe(1);
  MQTT.clearTopicTree();
});

test("wildcard-multi", () => {
  MQTT.subscribe({ ...sub, topic: "home/#" });
  expect(MQTT.getSubscribers("home/lights/kitchen").size).toBe(1);
  MQTT.clearTopicTree();
});
