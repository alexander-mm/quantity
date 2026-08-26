import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { QuoteController } from "./quote.controller.js";
import { createQuoteSchema, updateQuoteSchema, convertQuoteSchema } from "./quote.validator.js";

const router = Router();
const controller = new QuoteController();

router.get("/", authenticate, blockRoles(ROLES.PRODUCTION), controller.findAll.bind(controller));

router.get("/:id", authenticate, blockRoles(ROLES.PRODUCTION), controller.findById.bind(controller));

router.post(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(createQuoteSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(updateQuoteSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    controller.delete.bind(controller)
);

router.post(
    "/:id/convert",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(convertQuoteSchema),
    controller.convert.bind(controller)
);

export default router;
