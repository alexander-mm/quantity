import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";

import { InventoryAdjustmentController } from "./inventory-adjustment.controller.js";
import { createInventoryAdjustmentSchema } from "./inventory-adjustment.validator.js";

const router = Router();

const controller = new InventoryAdjustmentController();

router.get(
    "/",
    authenticate,
    controller.findAll.bind(controller)
);

router.post(
    "/",
    authenticate,
    validate(createInventoryAdjustmentSchema),
    controller.create.bind(controller)
);

export default router;
