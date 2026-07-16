import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { UserController } from "./user.controller.js";

import { createUserSchema } from "./user.validator.js";

const router = Router();

const controller = new UserController();

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
    validate(createUserSchema),
    controller.create.bind(controller)
);

export default router;