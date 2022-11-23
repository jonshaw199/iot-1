import express from "express";
import * as messageBrokerCtrl from "../controllers/messageBroker";

const rootRouter = express.Router();

rootRouter.ws("", messageBrokerCtrl.handleWS);

export default rootRouter;
