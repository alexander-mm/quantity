import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { WeeklyReportController } from "./weekly-report.controller.js";
import { generateCustomWeeklyReportSchema } from "./weekly-report.validator.js";

const router = Router();

const controller = new WeeklyReportController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findAll.bind(controller)
);

router.post(
    "/custom",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(generateCustomWeeklyReportSchema),
    controller.generateCustom.bind(controller)
);

router.get(
    "/:id/pdf",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.downloadPdf.bind(controller)
);

export default router;
