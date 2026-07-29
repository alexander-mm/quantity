import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { InventoryMovementController } from "./inventory-movement.controller.js";
import { createInventoryMovementSchema } from "./inventory-movement.validator.js";

const router = Router();

const controller = new InventoryMovementController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findAll.bind(controller)
);

router.get(
    "/kardex/:productId/:storeId",
    authenticate,
    controller.getKardex.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(createInventoryMovementSchema),
    controller.create.bind(controller)
);

export default router;