import { AccountReceivableService } from "../modules/account-receivable/account-receivable.service.js";
import { TelegramService, escapeTelegramHtml } from "../integrations/telegram/telegram.service.js";

const accountReceivableService = new AccountReceivableService();
const telegramService = new TelegramService();

const REMINDER_INTERVAL_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(from: Date, to: Date): number {
    return Math.floor((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

function formatAmount(amount: unknown, currency: string): string {
    return `${currency} ${Number(amount).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function runAccountReceivableAlerts(): Promise<void> {

    try {

        const pending = await accountReceivableService.findPendingWithDueDate();
        const now = new Date();
        const lines: string[] = [];
        const toMarkReminded: bigint[] = [];

        for (const item of pending) {

            const dueDate = item.dueDate;

            if (!dueDate) {
                continue;
            }

            const daysOverdue = daysBetween(dueDate, now);

            const dueToday = daysOverdue === 0;
            const overdue = daysOverdue > 0;

            const alreadyRemindedToday =
                item.lastReminderAt && daysBetween(item.lastReminderAt, now) === 0;

            if (alreadyRemindedToday) {
                continue;
            }

            let shouldAlert = false;

            if (dueToday) {
                shouldAlert = true;
            } else if (overdue) {

                const daysSinceLastReminder = item.lastReminderAt
                    ? daysBetween(item.lastReminderAt, now)
                    : daysOverdue;

                shouldAlert = daysSinceLastReminder >= REMINDER_INTERVAL_DAYS;

            }

            if (!shouldAlert) {
                continue;
            }

            const clientName =
                item.client.companyName ||
                `${item.client.firstName ?? ""} ${item.client.lastName ?? ""}`.trim() ||
                item.client.document;

            const statusLabel = dueToday
                ? "vence hoy"
                : `vencida hace ${daysOverdue} día(s)`;

            lines.push(
                `• ${escapeTelegramHtml(item.number)} - ${escapeTelegramHtml(clientName)}: ` +
                `${formatAmount(item.amount, item.currency)} (${statusLabel})`
            );

            toMarkReminded.push(item.id);

        }

        if (lines.length === 0) {
            return;
        }

        const message =
            "🟠 <b>Cuentas de cobro por vencer/vencidas</b>\n\n" +
            lines.join("\n");

        await telegramService.sendMessage(message);

        for (const id of toMarkReminded) {
            await accountReceivableService.markReminderSent(id);
        }

    } catch (error) {
        console.error("❌ Error generando la alerta de cuentas de cobro:", error);
    }

}
