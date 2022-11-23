import express from "express";

import { handleLightsWSReq } from "../controllers/lights";

const lightsRouter = express.Router();

lightsRouter.ws("/ws", handleLightsWSReq as any);

export default lightsRouter;
