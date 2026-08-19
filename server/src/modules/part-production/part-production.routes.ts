import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartProductionController } from "./part-production.controller.js";

const router = Router();

const controller = new PartProductionController();

router.get(
    "/preview/:partId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.preview.bind(controller)
);

export default router;
