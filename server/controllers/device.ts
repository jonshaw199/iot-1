import { Response } from "express";
import deviceModel from "../models/device";
import { Request } from "../types";

// list devices
export const index = (req: Request, res: Response) => {
  deviceModel.find(req.body, (err, devices) => {
    res.json(devices);
  });
};

// create a new device
export const create = (req: Request, res: Response) => {
  deviceModel.create(req.body, (err, org) => {
    if (err) return res.json({ success: false, code: err.code });
    res.json({
      success: true,
      msg: "Org created.",
      org,
    });
  });
};
