import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartCuttingOrderController } from "./part-cutting-order.controller.js";
import {
    createPartCuttingOrderSchema,
    updatePartCuttingOrderSchema,
    confirmPartCuttingOrderSchema
} from "./part-cutting-order.validator.js";

const router = Router();

const controller = new PartCuttingOrderController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findAll.bind(controller)
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
    validate(createPartCuttingOrderSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(updatePartCuttingOrderSchema),
    controller.update.bind(controller)
);

router.post(
    "/:id/confirm",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(confirmPartCuttingOrderSchema),
    controller.confirm.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.delete.bind(controller)
);

export default router;
