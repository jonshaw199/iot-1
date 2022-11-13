import { MessageType, WebSocket, Request } from "../types";
import Connections from "../connections";

export const handleLightsReq = (ws: WebSocket, req: Request) => {
  ws.on("message", (m) => {
    process.stdout.write("<");
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
        Connections.getLightsAudioClients(ws.orgId).forEach(function (
          client: any
        ) {
          client.send(JSON.stringify(out));
          process.stdout.write(">");
        });
        break;
      case MessageType.TYPE_INFO:
        console.log(`Info msg: ${JSON.stringify(msg.info)}`);
        ws.info = msg.info;
        break;
    }
  });
  ws.on("error", (err) => {
    console.log("/lights/ws err: " + err);
  });
  ws.on("close", () => {
    console.log("Closing /lights/ws");
  });
};
