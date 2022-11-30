import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../serverTypes";
import type { RootState } from "../state/store";

// Define a type for the slice state
interface MessageState {
  messages: Message[];
}

// Define the initial state using that type
const initialState: MessageState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: "message",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    recvMessage: (state: MessageState, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { recvMessage } = messageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const messagesSelector = (state: RootState) => state.messages.messages;

export default messageSlice.reducer;
