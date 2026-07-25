import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { SaleController } from "./sale.controller.js";
import { createSaleSchema } from "./sale.validator.js";

const router=Router();
const controller=new SaleController();

router.get("/",authenticate,controller.findAll.bind(controller));
router.get("/:id",authenticate,controller.findById.bind(controller));
router.post("/",authenticate,validate(createSaleSchema),controller.create.bind(controller));
router.put("/:id",authenticate,controller.update.bind(controller));
router.delete("/:id",authenticate,controller.delete.bind(controller));
router.post("/:id/confirm",authenticate,controller.confirm.bind(controller));

export default router;
