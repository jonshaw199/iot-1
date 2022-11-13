import express from "express";

import { handleLightsWSReq, handleRcReq } from "../controllers/lights";

const lightsRouter = express.Router();

lightsRouter.ws("/ws", handleLightsWSReq as any);

lightsRouter.post("/rc", handleRcReq);

export default lightsRouter;
