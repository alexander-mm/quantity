import { schedule } from "node-cron";
import { runLowStockAlert, runMediumStockAlert } from "./stock-alerts.job.js";
import { runWeeklyReport } from "./weekly-report.job.js";

const TIMEZONE = "America/Bogota";

export function startScheduledJobs(): void {

    // Stock bajo: cada 3 horas, en horario laboral (9am-6pm) de lunes a viernes → 9, 12, 15, 18.
    schedule("0 9-18/3 * * 1-5", () => { void runLowStockAlert(); }, { timezone: TIMEZONE });

    // Stock medio: 1 vez al día a las 9:00am, de lunes a viernes.
    schedule("0 9 * * 1-5", () => { void runMediumStockAlert(); }, { timezone: TIMEZONE });

    // Paquete semanal (ventas, dinero, comparación): lunes a las 9:00am.
    schedule("0 9 * * 1", () => { void runWeeklyReport(); }, { timezone: TIMEZONE });

    console.log("🕒 Jobs programados: stock bajo (cada 3h, 9am-6pm lun-vie), stock medio (diario 9am lun-vie), reportes semanales (lunes 9am).");

}
