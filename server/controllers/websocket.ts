import { WebSocket as WS } from "ws";
import { Types } from "mongoose";

import MQTT from "../mqtt";
import { WebSocketClient, Request } from "../types";
import deviceModel from "../models/device";
import Websocket from "../websocket";

export async function handleWs(w: WS, req: Request, next) {
  const ws = w as WebSocketClient;
  ws.request = req;
  try {
    const deviceId = new Types.ObjectId(req.query.deviceId?.toString());
    ws.device = await deviceModel.findById(deviceId);
  } catch (e) {
    next(e);
  }

  ws.on("message", (m) => {
    process.stdout.write("<");
    try {
      if (typeof m == "string") {
        try {
          const packet = JSON.parse(m);
          const clients = Websocket.getClients(
            ws.request.path,
            ws.device.orgId
          );
          const senderClient = clients.find((c) =>
            c.device._id.equals(ws.device._id)
          );
          MQTT.handlePacket({ packet, clients, senderClient });
        } catch (e) {
          console.log(`Error parsing JSON: ${m}, (${e})`);
        }
      } else {
        throw `Unknown message at ${ws.request.path}`;
      }
    } catch (e) {
      console.log(`Error receiving message: ${m} (${e})`);
    }
  });

  ws.on("error", (err) => {
    console.log(`${ws.request.path} error: ` + err);
  });

  ws.on("close", () => {
    console.log(`Closing connection at ${ws.request.path}`);
  });

  next();
}
