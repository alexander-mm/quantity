import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import {
    createCategorySchema
} from "./category.validator.js";

import { CategoryController } from "./category.controller.js";

const router = Router();

const controller = new CategoryController();

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
    validate(createCategorySchema),
    controller.create.bind(controller)
);

export default router;