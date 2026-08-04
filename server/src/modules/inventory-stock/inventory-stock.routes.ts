import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
import { InventoryStockController } from "./inventory-stock.controller.js";

const router = Router();
const controller = new InventoryStockController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    controller.findAll.bind(controller)
);

router.get(
    "/low-stock",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    controller.findLowStock.bind(controller)
);

router.get(
    "/product/:productId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    controller.findByProduct.bind(controller)
);

router.get(
    "/store/:storeId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    controller.findByStore.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    controller.findById.bind(controller)
);

export default router;
