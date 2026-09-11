import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize, blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { SaleController } from "./sale.controller.js";
import { createSaleSchema, updateSaleSchema, voidSaleSchema } from "./sale.validator.js";

const router=Router();
const controller=new SaleController();

router.get("/",authenticate,blockRoles(ROLES.PRODUCTION),controller.findAll.bind(controller));
router.get("/next-number/:storeId",authenticate,blockRoles(ROLES.PRODUCTION),controller.previewNextNumber.bind(controller));
router.get("/:id",authenticate,blockRoles(ROLES.PRODUCTION),controller.findById.bind(controller));
router.post("/",authenticate,blockRoles(ROLES.PRODUCTION),validate(createSaleSchema),controller.create.bind(controller));
router.put("/:id",authenticate,blockRoles(ROLES.PRODUCTION),validate(updateSaleSchema),controller.update.bind(controller));
router.delete("/:id",authenticate,blockRoles(ROLES.PRODUCTION),controller.delete.bind(controller));
router.post("/:id/confirm",authenticate,blockRoles(ROLES.PRODUCTION),controller.confirm.bind(controller));
router.post("/:id/void",authenticate,authorize(ROLES.ADMIN),validate(voidSaleSchema),controller.voidSale.bind(controller));

export default router;
