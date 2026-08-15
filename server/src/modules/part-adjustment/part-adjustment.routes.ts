import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartAdjustmentController } from "./part-adjustment.controller.js";
import { createPartAdjustmentSchema } from "./part-adjustment.validator.js";

const router = Router();

const controller = new PartAdjustmentController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(createPartAdjustmentSchema),
    controller.create.bind(controller)
);

export default router;
