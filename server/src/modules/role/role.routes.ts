import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { RoleController } from "./role.controller.js";

import { createRoleSchema } from "./role.validator.js";

const router = Router();

const controller = new RoleController();

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
    validate(createRoleSchema),
    controller.create.bind(controller)
);

export default router;