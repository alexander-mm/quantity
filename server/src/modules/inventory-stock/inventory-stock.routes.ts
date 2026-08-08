import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { blockRoles } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
import { InventoryStockController } from "./inventory-stock.controller.js";

const router = Router();
const controller = new InventoryStockController();

router.get(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

router.get(
    "/low-stock",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findLowStock.bind(controller)
);

router.get(
    "/medium-stock",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findMediumStock.bind(controller)
);

router.get(
    "/product/:productId",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findByProduct.bind(controller)
);

router.get(
    "/store/:storeId",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findByStore.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findById.bind(controller)
);

export default router;
