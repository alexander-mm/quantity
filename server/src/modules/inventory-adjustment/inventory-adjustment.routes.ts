import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { InventoryAdjustmentController } from "./inventory-adjustment.controller.js";
import { createInventoryAdjustmentSchema } from "./inventory-adjustment.validator.js";

const router = Router();

const controller = new InventoryAdjustmentController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findAll.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(createInventoryAdjustmentSchema),
    controller.create.bind(controller)
);

export default router;
