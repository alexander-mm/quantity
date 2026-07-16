import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";

import { DashboardController } from "./dashboard.controller.js";

const router = Router();

const controller = new DashboardController();

router.get(
    "/",
    authenticate,
    controller.getDashboard.bind(controller)
);

export default router;