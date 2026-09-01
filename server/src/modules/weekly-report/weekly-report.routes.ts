import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

import { WeeklyReportController } from "./weekly-report.controller.js";

const router = Router();

const controller = new WeeklyReportController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findAll.bind(controller)
);

router.get(
    "/:id/pdf",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.downloadPdf.bind(controller)
);

export default router;
