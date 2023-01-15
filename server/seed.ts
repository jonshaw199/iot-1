import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import deviceModel from "./models/device";
import orgModel from "./models/org";
import userModel from "./models/user";
import { Board } from "./types";

async function connect() {
  try {
    return await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.log(`Failed to connect to MongoDB: ${e}`);
  }
}

async function deleteAllDocuments() {
  try {
    await Promise.all([userModel.deleteMany({}), deviceModel.deleteMany({})]);
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
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "2",
      orgId: org.id,
      _id: "638a493afbbc51c90ce1ba9d",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "3",
      orgId: org.id,
      _id: "638a493ffbbc51c90ce1baa0",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "4",
      orgId: org.id,
      _id: "638a4941fbbc51c90ce1baa3",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "5",
      orgId: org.id,
      _id: "638a4944fbbc51c90ce1baa6",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "6",
      orgId: org.id,
      _id: "638a498b239dc28bfed416ad",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "7",
      orgId: org.id,
      _id: "638ccd0dc3573560b9cbbbc3",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "8",
      orgId: org.id,
      _id: "638ccd11c3573560b9cbbbc6",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "9",
      orgId: org.id,
      _id: "638ccd15c3573560b9cbbbc9",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "10",
      orgId: org.id,
      _id: "638ccd1ac3573560b9cbbbcc",
    }),
    new deviceModel({
      board: Board.BOARD_WEMOS_D1_MINI32,
      name: "11",
      orgId: org.id,
      _id: "63a0a9743c5ce31877af3455",
    }),
    new deviceModel({
      board: Board.BOARD_M5STICK_C,
      name: "15",
      orgId: org.id,
      _id: "637e682a353c2a48866b901d",
    }),
    new deviceModel({
      board: Board.BOARD_M5STICK_C,
      name: "18",
      orgId: org.id,
      _id: "637e6824353c2a48866b901a",
    }),
    new deviceModel({
      board: Board.BOARD_M5STACK_CORE2,
      name: "19",
      orgId: org.id,
      _id: "63c47ae8d7531ebb0ded4b9a",
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
