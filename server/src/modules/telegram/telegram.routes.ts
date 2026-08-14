import { Router } from "express";

import { TelegramController } from "./telegram.controller.js";

const router = Router();

const controller = new TelegramController();

// Sin authenticate/authorize: la protege el secret token de Telegram (ver telegram.controller.ts).
router.post(
    "/webhook",
    controller.handleWebhook.bind(controller)
);

export default router;
