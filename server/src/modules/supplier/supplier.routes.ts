import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { SupplierController } from "./supplier.controller.js";

const router=Router();
const controller=new SupplierController();

router.get("/",authenticate,controller.findAll.bind(controller));
router.get("/:id",authenticate,controller.findById.bind(controller));
router.post("/",authenticate,controller.create.bind(controller));
router.put("/:id",authenticate,controller.update.bind(controller));
router.delete("/:id",authenticate,controller.delete.bind(controller));

export default router;