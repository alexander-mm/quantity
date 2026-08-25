import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { blockRoles } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
import { DamagedStockController } from "./damaged-stock.controller.js";

const router = Router();
const controller = new DamagedStockController();

router.get(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

export default router;
