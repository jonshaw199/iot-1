import orgModel from "../models/org";

// list all orgs
export const index = (req, res) => {
  orgModel.find({}, (err, orgs) => {
    res.json(orgs);
  });
};

// create a new message
export const create = (req, res) => {
  orgModel.create(req.body, (err, org) => {
    if (err) return res.json({ success: false, code: err.code });
    res.json({
      success: true,
      msg: "Org created.",
      org,
    });
  });
};
