import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";

import { UserController } from "./user.controller.js";

import { createUserSchema } from "./user.validator.js";

const router = Router();

const controller = new UserController();

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
    validate(createUserSchema),
    controller.create.bind(controller)
);

export default router;