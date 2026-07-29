import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
import { MovementTypeController } from "./movement-type.controller.js";
import { createMovementTypeSchema } from "./movement-type.validator.js";

const router = Router();

const controller = new MovementTypeController();

router.get(
    "/",
    authenticate,
    controller.findAll.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(createMovementTypeSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(createMovementTypeSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.delete.bind(controller)
);

export type CreateMovementTypeInput =
    z.infer<typeof createMovementTypeSchema>;

export default router;