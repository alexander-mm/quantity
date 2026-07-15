import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { UnitOfMeasureController } from "./unit-of-measure.controller.js";

import { createUnitOfMeasureSchema } from "./unit-of-measure.validator.js";

const router = Router();

const controller = new UnitOfMeasureController();

router.get(
    "/",
    controller.findAll.bind(controller)
);

router.get(
    "/:id",
    controller.findById.bind(controller)
);

router.post(
    "/",
    validate(createUnitOfMeasureSchema),
    controller.create.bind(controller)
);

export default router;