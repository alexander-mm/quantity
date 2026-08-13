import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize, blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { ReturnController } from "./return.controller.js";
import { createReturnSchema, resolveReturnSchema } from "./return.validator.js";

const router = Router();
const controller = new ReturnController();

router.get("/", authenticate, blockRoles(ROLES.PRODUCTION), controller.findAll.bind(controller));

router.get("/:id", authenticate, blockRoles(ROLES.PRODUCTION), controller.findById.bind(controller));

router.post(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(createReturnSchema),
    controller.create.bind(controller)
);

router.post(
    "/:id/resolve",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(resolveReturnSchema),
    controller.resolve.bind(controller)
);

export default router;
