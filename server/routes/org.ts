import express from "express";
import * as orgCtrl from "../controllers/org";
import { verifyToken } from "../controllers/user";

const orgRouter = express.Router();

orgRouter.use(verifyToken);

orgRouter.route("/").get(orgCtrl.index).post(orgCtrl.create);

export default orgRouter;
