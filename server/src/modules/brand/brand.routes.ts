import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

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
    authorize(ROLES.ADMIN),
    validate(createBrandSchema),
    controller.create.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.delete.bind(controller)
);

export default router;