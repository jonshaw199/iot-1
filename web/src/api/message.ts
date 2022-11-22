import { Message, MessageResponse } from "../serverTypes";
import { req } from "./api";

export function create(m: Partial<Message>) {
  return req<MessageResponse>("/message", {
    method: "POST",
    body: JSON.stringify(m),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getList() {
  return req<Message[]>("/message");
}
