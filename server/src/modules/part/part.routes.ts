import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartController } from "./part.controller.js";
import { createPartSchema, updatePartSchema } from "./part.validator.js";

const router = Router();

const controller = new PartController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(createPartSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(updatePartSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.delete.bind(controller)
);

export default router;
