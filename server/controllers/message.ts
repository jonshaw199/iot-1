import messageModel from "../models/message";

// list messages
export const index = (req, res) => {
  messageModel.find(req.body, (err, messages) => {
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
