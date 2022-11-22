import express from "express";
import * as usersCtrl from "../controllers/user";

const usersRouter = express.Router();

usersRouter.post("/authenticate", usersCtrl.authenticate);

usersRouter.use(usersCtrl.verifyToken);

usersRouter.route("/").get(usersCtrl.index).post(usersCtrl.create);

usersRouter.post("/authWithToken", usersCtrl.authWithToken);

usersRouter
  .route("/:id")
  .get(usersCtrl.show)
  .patch(usersCtrl.update)
  .delete(usersCtrl.destroy);

export default usersRouter;
