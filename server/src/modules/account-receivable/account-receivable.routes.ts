import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { AccountReceivableController } from "./account-receivable.controller.js";
import { createAccountReceivablePaymentSchema, updateAccountReceivableSchema } from "./account-receivable.validator.js";

const router = Router();

const controller = new AccountReceivableController();

router.get(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findAll.bind(controller)
);

router.get(
    "/summary",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.summary.bind(controller)
);

router.get(
    "/next-number",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.nextNumber.bind(controller)
);

router.get(
    "/by-client/:clientId",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findByClient.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.findById.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(updateAccountReceivableSchema),
    controller.update.bind(controller)
);

router.post(
    "/:id/payments",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(createAccountReceivablePaymentSchema),
    controller.createPayment.bind(controller)
);

router.post(
    "/:id/mark-paid",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.markPaid.bind(controller)
);

export default router;
