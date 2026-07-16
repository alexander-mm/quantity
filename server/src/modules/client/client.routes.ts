import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";

import { ClientController } from "./client.controller.js";
import { createClientSchema } from "./client.validator.js";

const router = Router();

const controller = new ClientController();

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
    validate(createClientSchema),
    controller.create.bind(controller)
);

export default router;