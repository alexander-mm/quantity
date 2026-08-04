import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
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

router.get("/", authenticate, authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN), controller.findAll.bind(controller));
router.get("/:id", authenticate, authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN), controller.findById.bind(controller));

router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
    validate(createStockTransferSchema),
    controller.create.bind(controller)
);

router.post("/:id/confirm", authenticate, authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN), controller.confirm.bind(controller));

router.post(
    "/:id/report-issue",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.STORE, ROLES.TECHNICIAN),
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
