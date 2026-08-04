import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize, blockRoles } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { StockTransferController } from "./stock-transfer.controller.js";
import {
    createStockTransferSchema,
    reportIssueSchema,
    resolveStockTransferSchema
} from "./stock-transfer.validator.js";

const router = Router();
const controller = new StockTransferController();

router.get("/", authenticate, blockRoles(ROLES.PRODUCTION), controller.findAll.bind(controller));
router.get("/:id", authenticate, blockRoles(ROLES.PRODUCTION), controller.findById.bind(controller));

router.post(
    "/",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(createStockTransferSchema),
    controller.create.bind(controller)
);

router.post("/:id/confirm", authenticate, blockRoles(ROLES.PRODUCTION), controller.confirm.bind(controller));

router.post(
    "/:id/report-issue",
    authenticate,
    blockRoles(ROLES.PRODUCTION),
    validate(reportIssueSchema),
    controller.reportIssue.bind(controller)
);

router.post(
    "/:id/resolve",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(resolveStockTransferSchema),
    controller.resolve.bind(controller)
);

export default router;
