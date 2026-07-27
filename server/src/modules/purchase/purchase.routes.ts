import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { PurchaseController } from "./purchase.controller.js";

const router=Router();
const controller=new PurchaseController();

router.get("/",authenticate,controller.findAll.bind(controller));
router.get("/:id",authenticate,controller.findById.bind(controller));
router.post("/",authenticate,controller.create.bind(controller));
router.put("/:id",authenticate,controller.update.bind(controller));
router.delete("/:id",authenticate,controller.delete.bind(controller));
router.post("/:id/confirm",authenticate,controller.confirm.bind(controller));

export default router;