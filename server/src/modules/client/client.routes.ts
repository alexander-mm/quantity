import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { ClientController } from "./client.controller.js";
import { createClientSchema, updateClientSchema } from "./client.validator.js";

const router = Router();

const controller = new ClientController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    controller.findAll.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    validate(createClientSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
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