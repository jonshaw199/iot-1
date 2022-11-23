import { WebSocket as WS } from "ws";
import { Types } from "mongoose";

import MessageBroker from "../messageBroker";
import { WebSocket, Request } from "../types";
import deviceModel from "../models/device";

export async function handleWS(w: WS, req: Request, next) {
  const ws = w as WebSocket;
  ws.path = req.path;
  try {
    ws.deviceId = new Types.ObjectId(req.query.deviceId?.toString());
    const device = await deviceModel.findById(ws.deviceId);
    ws.orgId = device.orgId;
  } catch (e) {
    next(e);
  }

  ws.on("message", (m) => {
    process.stdout.write("<");
    const msg = JSON.parse(m.toString());
    MessageBroker.handleMQTTMsg({ msg, orgId: ws.orgId });
  });

  ws.on("error", (err) => {
    console.log(`${ws.path} error: ` + err);
  });

  ws.on("close", () => {
    console.log(`Closing connection at ${ws.path}`);
  });

  next();
}
