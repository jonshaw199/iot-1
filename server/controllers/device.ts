import { Response } from "express";
import { Error } from "mongoose";
import deviceModel from "../models/device";
import { Request } from "../types";

// list devices
export const index = (req: Request, res: Response) => {
  deviceModel.find(req.body, (err, devices) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({ devices });
  });
};

// create a new device
export const create = (req: Request, res: Response) => {
  deviceModel.create(req.body, (err: Error, device) => {
    if (err) return res.status(500).json({ msg: err.message });
    res.json({
      msg: "Device created.",
      device,
    });
  });
};
