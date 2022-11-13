import messageModel from "../models/message";

// list all messages
export const index = (req, res) => {
  messageModel.find({}, (err, messages) => {
    res.json(messages);
  });
};
