import { WebSocket as WS } from "ws";
import { Types } from "mongoose";

import MQTT from "../mqtt";
import { WebSocketClient, Request } from "../types";
import deviceModel from "../models/device";
import Websocket from "../websocket";

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export async function handleWs(w: WS, req: Request, next) {
  const ws = w as WebSocketClient;
  ws.path = req.path;
  try {
    const deviceId = new Types.ObjectId(req.query.deviceId?.toString());
    ws.device = await deviceModel.findById(deviceId);
  } catch (e) {
    next(e);
  }

  ws.on("message", (m) => {
    process.stdout.write("<");
    try {
      if (m instanceof Buffer) {
        const data = new Uint8Array(m.length);
        console.log(`Received binary: ${toHexString(data)}`);
        if (ws.path === "/audio") {
          console.log("Handle audio binary");
        } else if (ws.path === "/") {
          console.log("Handle lights binary");
        }
      } else if (typeof m == "string") {
        try {
          const packet = JSON.parse(m);
          const clients = Websocket.getClients(ws.path, ws.device.orgId);
          const senderClient = clients.find((c) =>
            c.device._id.equals(ws.device._id)
          );
          MQTT.handlePacket({ packet, clients, senderClient });
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
