import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UseWebSocket } from "../hooks/useWebsocket";
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

export const recvMessageThunk = createAsyncThunk(
  "message/receive",
  ({ msg, ws }: { msg: Packet; ws: UseWebSocket<Packet> }, thunkApi) => {
    switch (msg.type) {
      case MessageType.TYPE_MQTT_PUBLISH:
        if (msg.qos === 2) {
          thunkApi.dispatch(
            sendMessageThunk({
              msg: { ...msg, type: MessageType.TYPE_MQTT_PUBREC },
              ws,
            })
          );
        } else if (msg.qos === 1) {
          thunkApi.dispatch(
            sendMessageThunk({
              msg: { ...msg, type: MessageType.TYPE_MQTT_PUBACK },
              ws,
            })
          );
        }
        break;
      case MessageType.TYPE_MQTT_PUBREC:
        thunkApi.dispatch(
          sendMessageThunk({
            msg: { ...msg, type: MessageType.TYPE_MQTT_PUBREL },
            ws,
          })
        );
        break;
      case MessageType.TYPE_MQTT_PUBREL:
        thunkApi.dispatch(
          sendMessageThunk({
            msg: { ...msg, type: MessageType.TYPE_MQTT_PUBCOMP },
            ws,
          })
        );
        break;
    }
    return msg; // Return as received
  }
);

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  ({ msg, ws }: { msg: Packet; ws: UseWebSocket<Packet> }, thunkApi) => {
    if (msg.qos && msg.type === MessageType.TYPE_MQTT_PUBLISH) {
      msg.packetId = (thunkApi.getState() as MessageState).nextPacketId; // to do type safety
    }
    ws.send(msg);
    return msg;
  }
);

// Reducers

const recvMessageReducer = (
  state: MessageState,
  action: PayloadAction<Packet>
) => {
  switch (action.payload.type) {
    case MessageType.TYPE_MQTT_PUBACK:
    case MessageType.TYPE_MQTT_PUBCOMP:
      if (action.payload.packetId) {
        delete state.unackedMessages[action.payload.packetId];
      }
      break;
    case MessageType.TYPE_MQTT_PUBREC:
      if (action.payload.packetId) {
        state.unackedMessages[action.payload.packetId] = action.payload;
      }
      break;
  }
  state.messages.push(action.payload);
};

const sendMessageReducer = (
  state: MessageState,
  action: PayloadAction<Packet>
) => {
  switch (action.payload.type) {
    case MessageType.TYPE_MQTT_PUBLISH:
      if (action.payload.packetId) {
        state.nextPacketId++;
        if ((action.payload.qos || 0) > 0) {
          state.unackedMessages[action.payload.packetId] = action.payload;
        }
      }
      break;
    case MessageType.TYPE_MQTT_PUBREL:
      if (action.payload.packetId) {
        state.unackedMessages[action.payload.packetId] = action.payload;
      }
      break;
  }
  state.messages.push(action.payload);
};

export const messageSlice = createSlice({
  name: "message",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    recvMessage: recvMessageReducer,
    sendMessage: sendMessageReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(recvMessageThunk.fulfilled, recvMessageReducer);
    builder.addCase(sendMessageThunk.fulfilled, sendMessageReducer);
  },
});

export const { recvMessage, sendMessage } = messageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const messagesSelector = (state: RootState) => state.messages.messages;

export default messageSlice.reducer;
