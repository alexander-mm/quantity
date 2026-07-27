import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";

import { MarginProfileController } from "./margin-profile.controller.js";

import { createMarginProfileSchema } from "./margin-profile.validator.js";

const router = Router();

const controller = new MarginProfileController();

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
    validate(createMarginProfileSchema),
    controller.create.bind(controller)
);

export default router;