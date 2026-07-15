import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { ProductController } from "./product.controller.js";

import { createProductSchema } from "./product.validator.js";

const router = Router();

const controller = new ProductController();

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
    validate(createProductSchema),
    controller.create.bind(controller)
);

export default router;