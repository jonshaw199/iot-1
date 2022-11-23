import { Response } from "express";

import { MessageType, WebSocket, Request } from "../types";
import messageModel from "../models/message";

export const handleLightsWSReq = (ws: WebSocket, req: Request) => {
  ws.on("message", (m) => {
    console.log(`Lights msg: ${m}`);
    // To do
    const msg = JSON.parse(m.toString());
    switch (msg.type) {
      case MessageType.TYPE_MOTION:
        console.log(`Motion ${msg.motion ? "begin" : "end"}`);
        const out = {
          senderID: process.env.DEVICE_ID,
          type: msg.type,
          state: msg.state,
          motion: msg.motion,
        };
        /*Connections.getLightsAudioClients(ws.orgId).forEach(function (
          client: any
        ) {
          client.send(JSON.stringify(out));
          process.stdout.write(">");
        });*/
        break;
    }
  });
};

export const handleRcReq = (req: Request, res: Response) => {
  if (req.body.type === MessageType.TYPE_CHANGE_STATE) {
    console.log("Sending state change messages: " + req.body.state);
    const msg = JSON.stringify(req.body);
    /*const c = Connections.getLightsClients(req.params.orgId);
    c.forEach((client: any) => {
      client.send(msg);
    });*/
    return res.send(`/lights/rc: state change notification messages sent`);
  }
  res.send("lights//rc: message type not recognized");
};
