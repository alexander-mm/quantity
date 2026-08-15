import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { AuthController } from "./auth.controller.js";

import { loginSchema, refreshTokenSchema } from "./auth.validator.js";

const router = Router();

const controller = new AuthController();

router.post(
    "/login",
    validate(loginSchema),
    controller.login.bind(controller)
);

router.post(
    "/refresh",
    validate(refreshTokenSchema),
    controller.refresh.bind(controller)
);

router.post(
    "/logout",
    validate(refreshTokenSchema),
    controller.logout.bind(controller)
);

export default router;
