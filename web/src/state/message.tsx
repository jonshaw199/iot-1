import { Reducer, createContext } from "react";

import { Action } from "../types";
import { Message } from "../serverTypes";
import useReducerWithActions from "../hooks/useReducerWithActions";

export enum MessageActionType {}

type MessagePayload = {
  message?: Message;
};

type MessageState = {
  messages: Map<string, Message>;
};

const initialMessageState: MessageState = {
  messages: new Map(),
};

type MessageActionCreators = {};

const messageActionCreators: MessageActionCreators = {};

const messageReducer: Reducer<MessageState, Action<MessagePayload>> = (
  state,
  action
) => {
  switch (action.type) {
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
