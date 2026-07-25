import { Router } from "express";
import { PurchaseController } from "./purchase.controller.js";

const router=Router();
const controller=new PurchaseController();

router.get("/",controller.findAll.bind(controller));
router.get("/:id",controller.findById.bind(controller));
router.post("/",controller.create.bind(controller));
router.put("/:id",controller.update.bind(controller));
router.delete("/:id",controller.delete.bind(controller));
router.post("/:id/confirm", controller.confirm.bind(controller));

export default router;