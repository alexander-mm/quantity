import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { ProductPriceEntryController } from "./product-price-entry.controller.js";
import { replaceProductPriceEntriesSchema } from "./product-price-entry.validator.js";

const router = Router();
const controller = new ProductPriceEntryController();

router.get(
    "/labels",
    authenticate,
    controller.findLabels.bind(controller)
);

router.get(
    "/:productId",
    authenticate,
    controller.findByProduct.bind(controller)
);

router.put(
    "/:productId",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(replaceProductPriceEntriesSchema),
    controller.replaceForProduct.bind(controller)
);

export default router;
