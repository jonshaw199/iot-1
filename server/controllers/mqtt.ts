import { WebSocket as WS } from "ws";
import { Types } from "mongoose";

import MQTT from "../mqtt";
import { WebSocketClient, Request } from "../types";
import deviceModel from "../models/device";

export async function handleWS(w: WS, req: Request, next) {
  const ws = w as WebSocketClient;
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
    try {
      if (m instanceof Buffer) {
        const data = new Uint8Array(m.length);
        console.log(`Received binary: ${data}`);
      } else if (typeof m == "string") {
        try {
          const packet = JSON.parse(m);
          MQTT.handlePacket({ packet, orgId: ws.orgId });
        } catch (e) {
          console.log(`Error parsing JSON: ${m}, (${e})`);
        }
      } else {
        throw `Unknown message`;
      }
    } catch (e) {
      console.log(`Error receiving message: ${m} (${e})`);
    }
  });

  ws.on("error", (err) => {
    console.log(`${ws.path} error: ` + err);
  });

  ws.on("close", () => {
    console.log(`Closing connection at ${ws.path}`);
  });

  next();
}
