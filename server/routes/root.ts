import express from "express";
import * as websocketCtrl from "../controllers/websocket";

const rootRouter = express.Router();

rootRouter.ws("", websocketCtrl.handleWS);

export default rootRouter;
