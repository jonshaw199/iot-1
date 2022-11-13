import express from "express";

import { handleRcMsg } from "../controllers/rc";

const rcRouter = express.Router();

rcRouter.post("/", handleRcMsg);

export default rcRouter;
