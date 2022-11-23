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
import messageRouter from "./routes/message";
import deviceRouter from "./routes/device";
import MessageBroker from "./messageBroker";
import { handleWS } from "./controllers/messageBroker";
import rootRouter from "./routes/root";

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

app.use("/", rootRouter);

app.use(express.json());

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
