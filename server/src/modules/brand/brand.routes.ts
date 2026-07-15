import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { BrandController } from "./brand.controller.js";

import { createBrandSchema } from "./brand.validator.js";

const router = Router();

const controller = new BrandController();

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
    validate(createBrandSchema),
    controller.create.bind(controller)
);

export default router;