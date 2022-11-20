import express from "express";
import * as deviceCtrl from "../controllers/device";
import { verifyToken } from "../controllers/user";

const orgRouter = express.Router();

orgRouter.use(verifyToken);

orgRouter.route("/").get(deviceCtrl.index).post(deviceCtrl.create);

export default orgRouter;
