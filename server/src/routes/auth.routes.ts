import { Router } from "express";
import { AuthController } from "../controllers/AuthControllers.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../shared/validators/auth.validator.js";

const router = Router();

const authController = new AuthController();

router.post(
    "/login",
    validate(loginSchema),
    authController.login.bind(authController)
);
export default router;