import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { RawMaterialAdjustmentController } from "./raw-material-adjustment.controller.js";
import { createRawMaterialAdjustmentSchema } from "./raw-material-adjustment.validator.js";

const router = Router();

const controller = new RawMaterialAdjustmentController();

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
    validate(createRawMaterialAdjustmentSchema),
    controller.create.bind(controller)
);

export default router;
