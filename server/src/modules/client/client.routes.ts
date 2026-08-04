import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize, blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { ClientController } from "./client.controller.js";
import { createClientSchema, updateClientSchema } from "./client.validator.js";

const router = Router();

const controller = new ClientController();

router.get(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(createClientSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(updateClientSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.delete.bind(controller)
);

export default router;