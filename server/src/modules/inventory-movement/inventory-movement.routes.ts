import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize, blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { InventoryMovementController } from "./inventory-movement.controller.js";
import { createInventoryMovementSchema, updateInventoryMovementSchema } from "./inventory-movement.validator.js";

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
    blockRoles(ROLES.PRODUCTION),
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

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(updateInventoryMovementSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.delete.bind(controller)
);

router.post(
    "/:id/confirm",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.confirm.bind(controller)
);

export default router;