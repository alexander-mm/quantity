import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { PurchaseController } from "./purchase.controller.js";
import { updatePurchaseSchema } from "./purchase.validator.js";

const router=Router();
const controller=new PurchaseController();

router.get("/",authenticate,authorize(ROLES.ADMIN),controller.findAll.bind(controller));
router.get("/:id",authenticate,authorize(ROLES.ADMIN),controller.findById.bind(controller));
router.post("/",authenticate,authorize(ROLES.ADMIN),controller.create.bind(controller));
router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(updatePurchaseSchema),
    controller.update.bind(controller)
);
router.delete("/:id",authenticate,authorize(ROLES.ADMIN),controller.delete.bind(controller));
router.post("/:id/confirm",authenticate,authorize(ROLES.ADMIN),controller.confirm.bind(controller));

export default router;
