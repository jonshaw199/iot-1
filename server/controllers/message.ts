import { Error } from "mongoose";
import messageModel from "../models/message";

// list messages
export const index = (req, res) => {
  messageModel.find(req.body, (err, messages) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json(messages);
  });
};

// create a new message
export const create = (req, res) => {
  messageModel.create(req.body, (err: Error, message) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({
      msg: "Message created.",
      message,
    });
  });
};
