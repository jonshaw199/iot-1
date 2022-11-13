import express from "express";
import * as messageCtrl from "../controllers/message";
import { verifyToken } from "../controllers/user";

const messageRouter = express.Router();

messageRouter.use(verifyToken);

messageRouter.route("/").get(messageCtrl.index).post(messageCtrl.create);

export default messageRouter;
