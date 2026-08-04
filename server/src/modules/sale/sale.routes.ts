import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize, blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { SaleController } from "./sale.controller.js";
import { createSaleSchema } from "./sale.validator.js";

const router=Router();
const controller=new SaleController();

router.get("/",authenticate,blockRoles(ROLES.PRODUCTION),controller.findAll.bind(controller));
router.get("/:id",authenticate,blockRoles(ROLES.PRODUCTION),controller.findById.bind(controller));
router.post("/",authenticate,blockRoles(ROLES.PRODUCTION),validate(createSaleSchema),controller.create.bind(controller));
router.put("/:id",authenticate,authorize(ROLES.ADMIN),controller.update.bind(controller));
router.delete("/:id",authenticate,authorize(ROLES.ADMIN),controller.delete.bind(controller));
router.post("/:id/confirm",authenticate,blockRoles(ROLES.PRODUCTION),controller.confirm.bind(controller));

export default router;
