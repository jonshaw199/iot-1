import { Response } from "express";
import Connections from "../connections";

import { MessageType, Request } from "../types";

export const handleRcMsg = (req: Request, res: Response) => {
  if (req.body.type === MessageType.TYPE_CHANGE_STATE) {
    console.log("Sending state change messages: " + req.body.state);
    const msg = JSON.stringify(req.body);
    const c = Connections.getLightsClients(req.params.orgId);
    c.forEach((client: any) => {
      client.send(msg);
      console.log("sent");
    });
    return res.send(`/rc: state change notification messages sent`);
  }
  res.send("/rc: message type not recognized");
};
