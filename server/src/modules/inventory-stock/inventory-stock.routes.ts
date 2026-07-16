import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";

import { InventoryStockController } from "./inventory-stock.controller.js";

const router = Router();

const controller = new InventoryStockController();

router.get(
    "/",
    authenticate,
    controller.findAll.bind(controller)
);

router.get(
    "/low-stock",
    authenticate,
    controller.findLowStock.bind(controller)
);

router.get(
    "/product/:productId",
    authenticate,
    controller.findByProduct.bind(controller)
);

router.get(
    "/store/:storeId",
    authenticate,
    controller.findByStore.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    controller.findById.bind(controller)
);

export default router;