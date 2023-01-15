import express from "express";
import * as mqttCtrl from "../controllers/mqtt";

const rootRouter = express.Router();

rootRouter.ws("", mqttCtrl.handleWS);

export default rootRouter;
