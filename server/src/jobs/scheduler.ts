import { schedule } from "node-cron";
import { runLowStockAlert, runMediumStockAlert } from "./stock-alerts.job.js";
import { runWeeklyReport } from "./weekly-report.job.js";

const TIMEZONE = "America/Bogota";

export function startScheduledJobs(): void {

    // Stock bajo: cada 3 horas.
    schedule("0 */3 * * *", () => { void runLowStockAlert(); }, { timezone: TIMEZONE });

    // Stock medio: diario a las 7:00am.
    schedule("0 7 * * *", () => { void runMediumStockAlert(); }, { timezone: TIMEZONE });

    // Paquete semanal (ventas, dinero, comparación): lunes a las 7:00am.
    schedule("0 7 * * 1", () => { void runWeeklyReport(); }, { timezone: TIMEZONE });

    console.log("🕒 Jobs programados: stock bajo (cada 3h), stock medio (diario 7am), reportes semanales (lunes 7am).");

}
