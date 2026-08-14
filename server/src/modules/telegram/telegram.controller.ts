import { Request, Response } from "express";

import { env } from "../../config/env.js";
import { TelegramService } from "../../integrations/telegram/telegram.service.js";
import { handleCommand } from "./telegram-commands.service.js";

const SECRET_HEADER = "x-telegram-bot-api-secret-token";

export class TelegramController {

    private readonly telegramService = new TelegramService();

    async handleWebhook(
        req: Request,
        res: Response
    ): Promise<void> {

        // Telegram espera un 200 rápido; si tarda, reintenta el mismo update.
        res.status(200).json({ ok: true });

        try {

            if (!env.telegramWebhookSecret || req.header(SECRET_HEADER) !== env.telegramWebhookSecret) {
                return;
            }

            const message = req.body?.message;
            const chatId = message?.chat?.id;
            const text = message?.text;

            if (chatId === undefined || typeof text !== "string") {
                return;
            }

            if (!env.telegramChatId || chatId.toString() !== env.telegramChatId) {
                return;
            }

            const reply = await handleCommand(text);

            await this.telegramService.sendMessage(reply);

        } catch (error) {
            console.error("❌ Error procesando webhook de Telegram:", error);
        }

    }

}
