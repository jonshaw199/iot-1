import mongoose from "mongoose";

import { Org } from "../types";

const orgSchema = new mongoose.Schema<Org>();

// Duplicate the ID field.
orgSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orgSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<Org>("Org", orgSchema);
