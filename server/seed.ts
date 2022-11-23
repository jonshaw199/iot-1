import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import deviceModel from "./models/device";
import orgModel from "./models/org";
import userModel from "./models/user";
import { Board } from "./types";
import messageModel from "./models/message";

async function connect() {
  try {
    return await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.log(`Failed to connect to MongoDB: ${e}`);
  }
}

async function deleteAllDocuments() {
  try {
    await Promise.all([
      userModel.deleteMany({}),
      deviceModel.deleteMany({}),
      messageModel.deleteMany({}),
    ]);
    return await orgModel.deleteMany({});
  } catch (e) {
    console.log(`Failed to delete all documents before seeding: ${e}`);
  }
}

async function insertDocuments() {
  const org = new orgModel({ name: "root", _id: "637aaaf75fc12653601830c2" });

  const devices = [
    new deviceModel({
      board: Board.BOARD_OTHER,
      name: "webclient",
      orgId: org.id,
      _id: "637aab30382d30060fd5f4e3",
    }),
  ];

  const users = [
    new userModel({
      email: process.env.ROOT_EMAIL,
      password: process.env.ROOT_PASS,
      name: process.env.ROOT_NAME,
      orgId: org.id,
      _id: "637aab30382d30060fd5f4e4",
    }),
  ];

  try {
    await org.save();
    return Promise.all([
      ...devices.map((d) => d.save()),
      ...users.map((u) => u.save()),
    ]);
  } catch (e) {
    console.log(`Failed to seed DB with new documents: ${e}`);
  }
}

async function seed() {
  if (await connect()) {
    try {
      if (await deleteAllDocuments()) {
        await insertDocuments();
        console.log("Seed completed successfully");
      }
    } finally {
      mongoose.disconnect();
    }
  }
}

seed();
