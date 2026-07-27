import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";

import { UnitOfMeasureController } from "./unit-of-measure.controller.js";

import { createUnitOfMeasureSchema } from "./unit-of-measure.validator.js";

const router = Router();

const controller = new UnitOfMeasureController();

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
    validate(createUnitOfMeasureSchema),
    controller.create.bind(controller)
);

export default router;