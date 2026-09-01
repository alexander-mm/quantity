import type { ReportRange } from "../modules/reports/report-data.service.js";
import { WeeklyReportService } from "../modules/weekly-report/weekly-report.service.js";

const weeklyReportService = new WeeklyReportService();

function startOfWeek(reference: Date): Date {

    const date = new Date(reference);
    date.setHours(0, 0, 0, 0);

    const day = date.getDay(); // 0 = domingo ... 6 = sábado
    const diffToMonday = (day + 6) % 7;
    date.setDate(date.getDate() - diffToMonday);

    return date;

}

// La última semana completa (lunes a domingo) ya cerrada.
function getLastCompletedWeekRange(): ReportRange {

    const currentWeekStart = startOfWeek(new Date());

    const from = new Date(currentWeekStart);
    from.setDate(from.getDate() - 7);

    const to = new Date(from);
    to.setDate(to.getDate() + 6);
    to.setHours(23, 59, 59, 999);

    return { from, to };

}

function isoDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

export async function runWeeklyReport(): Promise<void> {

    try {

        const range = getLastCompletedWeekRange();
        const label = `${isoDate(range.from)} a ${isoDate(range.to)}`;

        // Se guarda siempre, incluso si el envío a Telegram falla, para poder
        // verlo/imprimirlo desde el programa y para dejar registro del error.
        await weeklyReportService.generateForRange(range, {
            sendToTelegram: true,
            telegramCaption: `📊 <b>Reporte semanal</b> (${label})\nVentas, dinero y comparación con la semana anterior.`
        });

    } catch (error) {
        console.error("❌ Error generando el paquete de reportes semanales:", error);
    }

}
