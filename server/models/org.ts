import mongoose from "mongoose";

import { Org } from "../types";

const orgSchema = new mongoose.Schema<Org>({
  name: { type: String },
});

const orgModel = mongoose.model<Org>("Org", orgSchema);

export default orgModel;
