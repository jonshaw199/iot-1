import { Response } from "express";
import orgModel from "../models/org";
import { Request } from "../types";

// list orgs
export const index = (req: Request, res: Response) => {
  orgModel.find(req.body, (err, orgs) => {
    res.json(orgs);
  });
};

// create a new org
export const create = (req: Request, res: Response) => {
  orgModel.create(req.body, (err, org) => {
    if (err) return res.json({ success: false, code: err.code });
    res.json({
      success: true,
      msg: "Org created.",
      org,
    });
  });
};
