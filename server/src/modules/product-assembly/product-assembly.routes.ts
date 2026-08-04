import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { ProductAssemblyController } from "./product-assembly.controller.js";
import { createProductAssemblySchema, updateProductAssemblySchema } from "./product-assembly.validator.js";

const router = Router();

const controller = new ProductAssemblyController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

router.get(
    "/preview/:productId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.preview.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(createProductAssemblySchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(updateProductAssemblySchema),
    controller.update.bind(controller)
);

router.post(
    "/:id/confirm",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.confirm.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.delete.bind(controller)
);

export default router;
