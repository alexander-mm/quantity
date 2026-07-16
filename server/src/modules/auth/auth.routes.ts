import { Router } from "express";

import { validate } from "../../middleware/validate.js";

import { AuthController } from "./auth.controller.js";

import { loginSchema } from "./auth.validator.js";

const router = Router();

const controller = new AuthController();

router.post(
    "/login",
    validate(loginSchema),
    controller.login.bind(controller)
);

export default router;