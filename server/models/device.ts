import mongoose from "mongoose";

import { Device } from "../types";

const deviceSchema = new mongoose.Schema<Device>({
  orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
  board: { type: String, required: true },
  name: { type: String, required: true },
});

const deviceModel = mongoose.model<Device>("Device", deviceSchema);

export default deviceModel;
