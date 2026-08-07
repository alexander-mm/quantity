import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { RawMaterialMovementController } from "./raw-material-movement.controller.js";
import { createRawMaterialMovementSchema } from "./raw-material-movement.validator.js";

const router = Router();

const controller = new RawMaterialMovementController();

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
    validate(createRawMaterialMovementSchema),
    controller.create.bind(controller)
);

export default router;
