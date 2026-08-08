import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartController } from "./part.controller.js";
import { createPartSchema, updatePartSchema } from "./part.validator.js";
import { updateMinimumStockSchema } from "../../shared/validators/minimum-stock.validator.js";

const router = Router();

const controller = new PartController();

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
    validate(createPartSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(updatePartSchema),
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
