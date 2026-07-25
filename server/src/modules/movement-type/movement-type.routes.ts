import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
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
    validate(createMovementTypeSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    validate(createMovementTypeSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    controller.delete.bind(controller)
);

export type CreateMovementTypeInput =
    z.infer<typeof createMovementTypeSchema>;

export default router;