import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { ProductController } from "./product.controller.js";
import { createProductSchema } from "./product.validator.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();
const controller = new ProductController();

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
    validate(createProductSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    validate(createProductSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    controller.delete.bind(controller)
);

export default router;