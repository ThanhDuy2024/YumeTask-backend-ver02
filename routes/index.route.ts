import { Router } from "express";
import accountRoute from "./account.route"
import taskRoute from "./task.route";
import { accountMiddleware } from "../middlewares/account.middleware";
const router = Router();

router.use("/account", accountRoute);

router.use("/task", accountMiddleware, taskRoute);

export default router;