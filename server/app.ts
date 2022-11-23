import express, { Response } from "express";
import express_ws, { Application } from "express-ws";
import dotenv from "dotenv";
import mongoose, { Types } from "mongoose";
import { WebSocket as WS } from "ws";
import cors from "cors";

const baseApp = express();
const expressWs = express_ws(baseApp);
const app = baseApp as unknown as Application;

dotenv.config();

import lightsRouter from "./routes/lights";
import usersRouter from "./routes/user";
import {
  MessageType,
  PayloadMessage,
  Request,
  TopicMessage,
  WebSocket,
} from "./types";
import orgRouter from "./routes/org";
import messageRouter from "./routes/message";
import deviceRouter from "./routes/device";
import MessageBroker from "./messageBroker";
import deviceModel from "./models/device";
import messageModel from "./models/message";

MessageBroker.init(expressWs);

mongoose.connect(process.env.MONGODB_URI, null, (err) => {
  console.log(err || `Connected to MongoDB.`);
});

app.use(cors());

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.ws("*", async (w: WS, req: Request, next) => {
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

    messageModel.create(
      {
        senderID: ws.deviceId,
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
          `Subscribe device ID: ${ws.deviceId}; topic: ${subscribeMsg.topic}`
        );
        MessageBroker.subscribe(ws.deviceId, subscribeMsg.topic);
        break;
      case MessageType.TYPE_MQTT_UNSUBSCRIBE:
        const unsubscribeMsg = msg as TopicMessage;
        console.log(
          `Unsubscribe device ID: ${ws.deviceId}; topic: ${unsubscribeMsg.topic}`
        );
        MessageBroker.unsubscribe(ws.deviceId, unsubscribeMsg.topic);
        break;
      case MessageType.TYPE_MQTT_PAYLOAD:
        const payloadMsg = msg as PayloadMessage<any>;
        console.log(`Payload message for topic ${payloadMsg.topic}`);
        // Send to subscribers
        break;
    }
  });

  ws.on("error", (err) => {
    console.log(`${ws.path} error: ` + err);
  });

  ws.on("close", () => {
    console.log(`Closing connection at ${ws.path}`);
  });

  next();
});

app.use(express.json());

app.use("/lights", lightsRouter);
app.use("/user", usersRouter);
app.use("/org", orgRouter);
app.use("/message", messageRouter);
app.use("/device", deviceRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(process.env.PORT, () => {
  console.log(`AF1 server is running on port ${process.env.PORT}.`);
});
