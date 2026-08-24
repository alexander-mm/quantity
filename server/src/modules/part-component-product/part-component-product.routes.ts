import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartComponentProductController } from "./part-component-product.controller.js";
import { setPartComponentProductsSchema } from "./part-component-product.validator.js";

const router = Router();

const controller = new PartComponentProductController();

router.get(
    "/:partId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findByPart.bind(controller)
);

router.put(
    "/:partId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(setPartComponentProductsSchema),
    controller.set.bind(controller)
);

export default router;