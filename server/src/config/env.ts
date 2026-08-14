export const env = {

    databaseUrl: process.env.DATABASE_URL!,

    jwtSecret: process.env.JWT_SECRET!,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,

    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,

    telegramChatId: process.env.TELEGRAM_CHAT_ID,

    telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET

}