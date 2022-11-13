import mongoose from "mongoose";

import { Org } from "../types";

const orgSchema = new mongoose.Schema<Org>();

export default mongoose.model<Org>("Org", orgSchema);
