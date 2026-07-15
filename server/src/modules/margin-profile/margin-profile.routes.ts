import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { MarginProfileController } from "./margin-profile.controller.js";

import { createMarginProfileSchema } from "./margin-profile.validator.js";

const router = Router();

const controller = new MarginProfileController();

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
    validate(createMarginProfileSchema),
    controller.create.bind(controller)
);

export default router;