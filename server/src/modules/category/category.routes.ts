import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";

import {
    createCategorySchema
} from "./category.validator.js";

import { CategoryController } from "./category.controller.js";

const router = Router();

const controller = new CategoryController();

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
    validate(createCategorySchema),
    controller.create.bind(controller)
);

export default router;