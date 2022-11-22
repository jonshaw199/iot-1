import { Reducer, createContext } from "react";

import { Action } from "../types";
import { Message } from "../serverTypes";
import { getList, create } from "../api/message";
import useReducerWithActions from "../hooks/useReducerWithActions";

export enum MessageActionType {
  GET_LIST = "GET_LIST",
  CREATE = "CREATE",
}

type MessagePayload = {
  messages?: Message[];
  message?: Message;
};

type MessageState = {
  messages: Map<string, Message>;
  errorMsg: string;
};

const initialMessageState: MessageState = {
  messages: new Map(),
  errorMsg: "",
};

type MessageActionCreators = {
  getList: () => Promise<Action<MessagePayload>>;
  create: (message: Partial<Message>) => Promise<Action<MessagePayload>>;
};

const messageActionCreators: MessageActionCreators = {
  getList: () =>
    getList().then((messages) => ({
      type: MessageActionType.GET_LIST,
      payload: { messages },
    })),
  create: (message: Partial<Message>) =>
    create(message).then(({ message }) => ({
      type: MessageActionType.CREATE,
      payload: { message },
    })),
};

const messageReducer: Reducer<MessageState, Action<MessagePayload>> = (
  state,
  action
) => {
  state.errorMsg = "";
  try {
    switch (action.type) {
      case MessageActionType.CREATE:
        if (action.payload?.message) {
          state = {
            ...state,
            messages: new Map(state.messages).set(
              action.payload.message._id.toString(),
              action.payload.message
            ),
          };
        } else {
          throw new Error("No message");
        }
        break;
      case MessageActionType.GET_LIST:
        if (action.payload?.messages) {
          state = {
            ...state,
            messages: action.payload.messages.reduce(
              (prev, cur) => prev.set(cur._id, cur),
              new Map()
            ),
          };
        } else {
          throw new Error("No message list");
        }
        break;
    }
  } catch (e) {
    if (typeof e === "string") {
      state.errorMsg = e;
    }
  }
  return state;
};

export function useMessageState() {
  return useReducerWithActions<
    MessageState,
    MessagePayload,
    MessageActionCreators
  >({
    reducer: messageReducer,
    initialState: initialMessageState,
    actionCreators: messageActionCreators,
  });
}

export const GlobalMessageContext = createContext({
  ...initialMessageState,
  ...messageActionCreators,
});
