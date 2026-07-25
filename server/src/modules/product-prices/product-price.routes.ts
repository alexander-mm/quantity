import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { ProductPriceController } from "./product-price.controller.js";

const router = Router();
const controller = new ProductPriceController();

router.get(
    "/:productId",
    authenticate,
    controller.findByProduct.bind(controller)
);

export default router;
