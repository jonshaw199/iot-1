import express from "express";

import { handleLightsReq } from "../controllers/lights";

const lightsRouter = express.Router();

lightsRouter.ws("/ws", handleLightsReq as any);

export default lightsRouter;
