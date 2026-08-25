import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { PartRecipeController } from "./part-recipe.controller.js";
import { setPartRecipeSchema } from "./part-recipe.validator.js";

const router = Router();

const controller = new PartRecipeController();

router.get(
    "/:partId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findByPart.bind(controller)
);

router.put(
    "/:partId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(setPartRecipeSchema),
    controller.set.bind(controller)
);

router.delete(
    "/:partId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.remove.bind(controller)
);

export default router;
