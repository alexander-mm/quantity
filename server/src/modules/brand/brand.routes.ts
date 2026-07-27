import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";

import { BrandController } from "./brand.controller.js";

import { createBrandSchema } from "./brand.validator.js";

const router = Router();

const controller = new BrandController();

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
    validate(createBrandSchema),
    controller.create.bind(controller)
);

export default router;