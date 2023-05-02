import express from "express";
import express_ws, { Application } from "express-ws";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const baseApp = express();
const expressWs = express_ws(baseApp);
const app = baseApp as unknown as Application;

dotenv.config();

import usersRouter from "./routes/user";
import orgRouter from "./routes/org";
import deviceRouter from "./routes/device";
import MQTT from "./mqtt";
import rootRouter from "./routes/root";
import Websocket from "./websocket";

Websocket.init(expressWs);
MQTT.init();

mongoose.connect(process.env.MONGODB_URI, null, (err) => {
  console.log(err || `Connected to MongoDB.`);
});

app.use(cors());

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

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

app.use(express.json());

app.use("/", rootRouter);
app.use("/user", usersRouter);
app.use("/org", orgRouter);
app.use("/device", deviceRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(port ? `AF1 server is running on port ${port}.` :  `Wheres me envs`)
});
