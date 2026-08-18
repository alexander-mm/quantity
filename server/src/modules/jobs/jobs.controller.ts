import { Request, Response } from "express";

import { env } from "../../config/env.js";
import { runLowStockAlert, runMediumStockAlert } from "../../jobs/stock-alerts.job.js";
import { runWeeklyReport } from "../../jobs/weekly-report.job.js";
import { runAccountReceivableAlerts } from "../../jobs/account-receivable-alerts.job.js";

const BUSINESS_TIMEZONE = "America/Bogota";
const WEEKDAY_MAP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// El cron externo (cron-job.org, plan gratuito) no permite elegir varios días ni horas a
// la vez en modo personalizado, así que se configura simple ("cada 3h", "todos los días a
// las 9am") y es el servidor el que decide, en la zona horaria real del negocio, si
// corresponde hacer algo — evita tener que crear un cronjob por cada combinación de
// día/hora del lado externo.
function getBogotaParts(): { weekday: number; hour: number } {

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: BUSINESS_TIMEZONE,
        weekday: "short",
        hour: "2-digit",
        hourCycle: "h23"
    }).formatToParts(new Date());

    const weekdayShort = parts.find(part => part.type === "weekday")!.value;
    const hour = Number(parts.find(part => part.type === "hour")!.value);

    return { weekday: WEEKDAY_MAP[weekdayShort], hour };

}

function isWeekday(): boolean {
    const { weekday } = getBogotaParts();
    return weekday >= 1 && weekday <= 5;
}

function isBusinessHours(): boolean {
    const { weekday, hour } = getBogotaParts();
    return weekday >= 1 && weekday <= 5 && hour >= 9 && hour <= 18;
}

export class JobsController {

    private isAuthorized(req: Request): boolean {
        return !!env.jobsTriggerSecret && req.query.secret === env.jobsTriggerSecret;
    }

    async lowStock(req: Request, res: Response): Promise<void> {

        if (!this.isAuthorized(req)) {
            res.status(404).json({ ok: false });
            return;
        }

        if (!isBusinessHours()) {
            res.status(200).json({ ok: true, skipped: "outside business hours" });
            return;
        }

        await runLowStockAlert();
        res.status(200).json({ ok: true });

    }

    async mediumStock(req: Request, res: Response): Promise<void> {

        if (!this.isAuthorized(req)) {
            res.status(404).json({ ok: false });
            return;
        }

        if (!isWeekday()) {
            res.status(200).json({ ok: true, skipped: "weekend" });
            return;
        }

        await runMediumStockAlert();
        res.status(200).json({ ok: true });

    }

    async weeklyReport(req: Request, res: Response): Promise<void> {

        if (!this.isAuthorized(req)) {
            res.status(404).json({ ok: false });
            return;
        }

        await runWeeklyReport();
        res.status(200).json({ ok: true });

    }

    async accountReceivableAlerts(req: Request, res: Response): Promise<void> {

        if (!this.isAuthorized(req)) {
            res.status(404).json({ ok: false });
            return;
        }

        if (!isBusinessHours()) {
            res.status(200).json({ ok: true, skipped: "outside business hours" });
            return;
        }

        await runAccountReceivableAlerts();
        res.status(200).json({ ok: true });

    }

}
