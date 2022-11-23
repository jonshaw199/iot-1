import { WebSocket as WS } from "ws";
import { Types } from "mongoose";

import MessageBroker from "../messageBroker";
import messageModel from "../models/message";
import {
  MessageType,
  PayloadMessage,
  TopicMessage,
  WebSocket,
  Request,
} from "../types";
import deviceModel from "../models/device";

export function handleMQTTMsg(
  m: any,
  senderID: Types.ObjectId,
  orgID: Types.ObjectId
) {
  process.stdout.write("<");
  const msg = JSON.parse(m.toString());

  messageModel.create(
    {
      senderID,
      state: msg.state,
      type: msg.type,
    },
    (err, m) => {
      if (err) {
        console.log(`Error creating message: ${err}`);
      }
    }
  );

  switch (msg.type) {
    case MessageType.TYPE_MQTT_SUBSCRIBE:
      const subscribeMsg = msg as TopicMessage;
      console.log(
        `Subscribe device ID: ${senderID}; topic: ${subscribeMsg.topic}`
      );
      MessageBroker.subscribe(senderID, subscribeMsg.topic);
      break;
    case MessageType.TYPE_MQTT_UNSUBSCRIBE:
      const unsubscribeMsg = msg as TopicMessage;
      console.log(
        `Unsubscribe device ID: ${senderID}; topic: ${unsubscribeMsg.topic}`
      );
      MessageBroker.unsubscribe(senderID, unsubscribeMsg.topic);
      break;
    case MessageType.TYPE_MQTT_PAYLOAD:
      const payloadMsg = msg as PayloadMessage<any>;
      console.log(`Payload message for topic ${payloadMsg.topic}`);
      MessageBroker.broadcast({
        topic: payloadMsg.topic,
        orgId: orgID,
        msg: payloadMsg,
      });
      break;
  }
}

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

  ws.on("message", (m) => handleMQTTMsg(m, ws.deviceId, ws.orgId));

  ws.on("error", (err) => {
    console.log(`${ws.path} error: ` + err);
  });

  ws.on("close", () => {
    console.log(`Closing connection at ${ws.path}`);
  });

  next();
}
