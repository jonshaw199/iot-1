import messageModel from "../models/message";

// list all messages; To Do pagination
export const index = (req, res) => {
  messageModel.find({}, (err, messages) => {
    res.json(messages);
  });
};

// create a new message
export const create = (req, res) => {
  messageModel.create(req.body, (err, message) => {
    if (err) return res.json({ success: false, code: err.code });
    res.json({
      success: true,
      msg: "Message created.",
      message,
    });
  });
};
