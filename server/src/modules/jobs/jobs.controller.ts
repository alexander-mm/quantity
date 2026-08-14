import { Request, Response } from "express";

import { env } from "../../config/env.js";
import { runLowStockAlert, runMediumStockAlert } from "../../jobs/stock-alerts.job.js";
import { runWeeklyReport } from "../../jobs/weekly-report.job.js";

export class JobsController {

    private isAuthorized(req: Request): boolean {
        return !!env.jobsTriggerSecret && req.query.secret === env.jobsTriggerSecret;
    }

    async lowStock(req: Request, res: Response): Promise<void> {

        if (!this.isAuthorized(req)) {
            res.status(404).json({ ok: false });
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

}
