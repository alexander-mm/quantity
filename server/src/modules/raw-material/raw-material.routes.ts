import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { RawMaterialController } from "./raw-material.controller.js";
import { createRawMaterialSchema, updateRawMaterialSchema } from "./raw-material.validator.js";
import { updateMinimumStockSchema } from "../../shared/validators/minimum-stock.validator.js";

const router = Router();

const controller = new RawMaterialController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

router.get(
    "/low-stock",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findLowStock.bind(controller)
);

router.get(
    "/medium-stock",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findMediumStock.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(createRawMaterialSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(updateRawMaterialSchema),
    controller.update.bind(controller)
);

router.patch(
    "/:id/minimum-stock",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(updateMinimumStockSchema),
    controller.updateMinimumStock.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.delete.bind(controller)
);

export default router;
