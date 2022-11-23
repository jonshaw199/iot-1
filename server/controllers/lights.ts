import { Response } from "express";

import { MessageType, WebSocket, Request } from "../types";
import messageModel from "../models/message";

export const handleLightsWSReq = (ws: WebSocket, req: Request) => {
  ws.on("message", (m) => {
    console.log(`Lights msg: ${m}`);
  });
};
