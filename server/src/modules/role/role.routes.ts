import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";

import { RoleController } from "./role.controller.js";

import { createRoleSchema } from "./role.validator.js";

const router = Router();

const controller = new RoleController();

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
    validate(createRoleSchema),
    controller.create.bind(controller)
);

export default router;