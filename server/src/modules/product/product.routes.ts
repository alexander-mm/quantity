import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { ProductController } from "./product.controller.js";
import { createProductSchema } from "./product.validator.js";
import { updateMinimumStockSchema } from "../../shared/validators/minimum-stock.validator.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();
const controller = new ProductController();

router.get(
    "/",
    authenticate,
    controller.findAll.bind(controller)
);

router.get(
    "/kit-availability",
    authenticate,
    controller.kitAvailability.bind(controller)
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
    validate(createProductSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(createProductSchema),
    controller.update.bind(controller)
);

router.patch(
    "/:id/minimum-stock",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(updateMinimumStockSchema),
    controller.updateMinimumStock.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.delete.bind(controller)
);

export default router;