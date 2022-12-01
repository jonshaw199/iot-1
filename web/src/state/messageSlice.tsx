import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageType, Packet, PacketId } from "../serverTypes";
import type { RootState } from "../state/store";

// Define a type for the slice state
interface MessageState {
  messages: Packet[];
  unackedMessages: { [key: PacketId]: Packet };
  nextPacketId: PacketId;
}

// Define the initial state using that type
const initialState: MessageState = {
  messages: [],
  unackedMessages: {},
  nextPacketId: 0,
};

// Thunks

const recvMessageThunk = createAsyncThunk(
  "message/receive",
  (msg: Packet, thunkApi) => {
    switch (msg.type) {
      case MessageType.TYPE_MQTT_PUBACK:
        console.log("Pub ack");
        break;
    }
    return msg;
  }
);

// const sendMessageThunk = createA

// Reducers

const recvMessageReducer = (
  state: MessageState,
  action: PayloadAction<Packet>
) => {
  switch (action.payload.type) {
    case MessageType.TYPE_MQTT_PUBACK:
      console.log("Pub ack");
      if (action.payload.packetId) {
        delete state.unackedMessages[action.payload.packetId];
      }
      break;
  }
  state.messages.push(action.payload);
};

const sendMessageReducer = (
  state: MessageState,
  action: PayloadAction<Packet>
) => {
  state.messages.push(action.payload);
};

export const messageSlice = createSlice({
  name: "message",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    recvMessage: recvMessageReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(recvMessageThunk.fulfilled, recvMessageReducer);
  },
});

export const { recvMessage } = messageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const messagesSelector = (state: RootState) => state.messages.messages;

export default messageSlice.reducer;
