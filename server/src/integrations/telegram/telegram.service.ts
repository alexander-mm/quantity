import { env } from "../../config/env.js";

const TELEGRAM_API_BASE = "https://api.telegram.org";

export function escapeTelegramHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

let warnedMissingConfig = false;

function isConfigured(): boolean {

    if (env.telegramBotToken && env.telegramChatId) {
        return true;
    }

    if (!warnedMissingConfig) {
        console.warn(
            "⚠️  TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID no configurados. Se omiten las notificaciones de Telegram."
        );
        warnedMissingConfig = true;
    }

    return false;

}

export class TelegramService {

    async sendMessage(text: string): Promise<void> {

        if (!isConfigured()) {
            return;
        }

        try {

            const response = await fetch(
                `${TELEGRAM_API_BASE}/bot${env.telegramBotToken}/sendMessage`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: env.telegramChatId,
                        text,
                        parse_mode: "HTML"
                    })
                }
            );

            if (!response.ok) {
                console.error(`❌ Telegram sendMessage falló: ${response.status} ${await response.text()}`);
            }

        } catch (error) {
            console.error("❌ Error enviando mensaje a Telegram:", error);
        }

    }

    async sendDocument(buffer: Buffer, filename: string, caption?: string): Promise<{ ok: boolean; error?: string }> {

        if (!isConfigured()) {
            return { ok: false, error: "Telegram no configurado (falta TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID)." };
        }

        try {

            const form = new FormData();
            form.append("chat_id", env.telegramChatId!);
            form.append("document", new Blob([new Uint8Array(buffer)], { type: "application/pdf" }), filename);

            if (caption) {
                form.append("caption", caption);
            }

            const response = await fetch(
                `${TELEGRAM_API_BASE}/bot${env.telegramBotToken}/sendDocument`,
                {
                    method: "POST",
                    body: form
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Telegram sendDocument falló: ${response.status} ${errorText}`);
                return { ok: false, error: `HTTP ${response.status}: ${errorText}` };
            }

            return { ok: true };

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`❌ Error enviando documento "${filename}" a Telegram:`, error);
            return { ok: false, error: message };
        }

    }

}
