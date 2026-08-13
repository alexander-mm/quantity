import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartComponentController } from "./part-component.controller.js";
import { setPartComponentsSchema } from "./part-component.validator.js";

const router = Router();

const controller = new PartComponentController();

router.get(
    "/with-recipe",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findPartIdsWithRecipe.bind(controller)
);

router.get(
    "/:partId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findByPart.bind(controller)
);

router.put(
    "/:partId",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(setPartComponentsSchema),
    controller.set.bind(controller)
);

export default router;