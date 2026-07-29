import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
import { SupplierController } from "./supplier.controller.js";

const router=Router();
const controller=new SupplierController();

router.get("/",authenticate,authorize(ROLES.ADMIN),controller.findAll.bind(controller));
router.get("/:id",authenticate,authorize(ROLES.ADMIN),controller.findById.bind(controller));
router.post("/",authenticate,authorize(ROLES.ADMIN),controller.create.bind(controller));
router.put("/:id",authenticate,authorize(ROLES.ADMIN),controller.update.bind(controller));
router.delete("/:id",authenticate,authorize(ROLES.ADMIN),controller.delete.bind(controller));

export default router;
