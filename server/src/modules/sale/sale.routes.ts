import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { SaleController } from "./sale.controller.js";
import { createSaleSchema } from "./sale.validator.js";

const router=Router();
const controller=new SaleController();

router.get("/",authenticate,controller.findAll.bind(controller));
router.get("/:id",authenticate,controller.findById.bind(controller));
router.post("/",authenticate,validate(createSaleSchema),controller.create.bind(controller));
router.put("/:id",authenticate,authorize(ROLES.ADMIN),controller.update.bind(controller));
router.delete("/:id",authenticate,authorize(ROLES.ADMIN),controller.delete.bind(controller));
router.post("/:id/confirm",authenticate,controller.confirm.bind(controller));

export default router;
