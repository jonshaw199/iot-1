import { Response } from "express";
import { Error } from "mongoose";
import orgModel from "../models/org";
import { Request } from "../types";

// list orgs
export const index = (req: Request, res: Response) => {
  orgModel.find(req.body, (err, orgs) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({ orgs });
  });
};

// create a new org
export const create = (req: Request, res: Response) => {
  orgModel.create(req.body, (err: Error, org) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({
      msg: "Org created.",
      org,
    });
  });
};
