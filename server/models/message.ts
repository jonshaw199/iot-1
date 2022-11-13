import mongoose from "mongoose";

import { Message } from "../types";

const messageSchema = new mongoose.Schema<Message>({
  state: { type: Number },
  senderID: { type: Number, required: true },
  type: { type: Number, required: true },
  transportType: { type: Number },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Org" },
});

export default mongoose.model<Message>("Message", messageSchema);
