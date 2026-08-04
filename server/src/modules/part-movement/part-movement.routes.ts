import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartMovementController } from "./part-movement.controller.js";
import { createPartMovementSchema } from "./part-movement.validator.js";

const router = Router();

const controller = new PartMovementController();

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
    validate(createPartMovementSchema),
    controller.create.bind(controller)
);

export default router;
