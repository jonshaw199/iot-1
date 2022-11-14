import mongoose from "mongoose";

import { Message } from "../types";

const messageSchema = new mongoose.Schema<Message>(
  {
    state: { type: Number },
    senderID: { type: Number, required: true },
    type: { type: Number, required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Org" },
  },
  { capped: { size: 1024 } }
);

const messageModel = mongoose.model<Message>("Message", messageSchema);

export default messageModel;
