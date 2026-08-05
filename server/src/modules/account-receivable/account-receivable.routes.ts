import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { AccountReceivableController } from "./account-receivable.controller.js";
import { updateAccountReceivableSchema } from "./account-receivable.validator.js";

const router = Router();

const controller = new AccountReceivableController();

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findAll.bind(controller)
);

router.get(
    "/summary",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.summary.bind(controller)
);

router.get(
    "/by-client/:clientId",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findByClient.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findById.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(updateAccountReceivableSchema),
    controller.update.bind(controller)
);

router.post(
    "/:id/mark-paid",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.markPaid.bind(controller)
);

export default router;
