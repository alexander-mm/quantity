import { ReportDataService, type ReportRange } from "../modules/reports/report-data.service.js";
import { buildWeeklyReportPdf } from "../modules/reports/report-pdf.builder.js";
import { TelegramService } from "../integrations/telegram/telegram.service.js";
import { WeeklyReportRepository } from "../modules/weekly-report/weekly-report.repository.js";

const reportDataService = new ReportDataService();
const telegramService = new TelegramService();
const weeklyReportRepository = new WeeklyReportRepository();

function startOfWeek(reference: Date): Date {

    const date = new Date(reference);
    date.setHours(0, 0, 0, 0);

    const day = date.getDay(); // 0 = domingo ... 6 = sábado
    const diffToMonday = (day + 6) % 7;
    date.setDate(date.getDate() - diffToMonday);

    return date;

}

// weeksAgo=0 -> la última semana completa (lunes a domingo) ya cerrada; weeksAgo=1 -> la anterior a esa.
function getCompletedWeekRange(weeksAgo: number): ReportRange {

    const currentWeekStart = startOfWeek(new Date());

    const from = new Date(currentWeekStart);
    from.setDate(from.getDate() - 7 * (weeksAgo + 1));

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

        const currentRange = getCompletedWeekRange(0);
        const previousRange = getCompletedWeekRange(1);

        const [currentData, previousData] = await Promise.all([
            reportDataService.getReportData(currentRange),
            reportDataService.getReportData(previousRange)
        ]);

        const pdf = await buildWeeklyReportPdf(currentData, previousData);

        const label = `${isoDate(currentRange.from)} a ${isoDate(currentRange.to)}`;

        const telegramResult = await telegramService.sendDocument(
            pdf,
            `reporte-semanal-${isoDate(currentRange.from)}.pdf`,
            `📊 <b>Reporte semanal</b> (${label})\nVentas, dinero y comparación con la semana anterior.`
        );

        // Se guarda siempre, incluso si el envío a Telegram falló, para poder
        // verlo/imprimirlo desde el programa y para dejar registro del error.
        await weeklyReportRepository.create({
            weekStart: currentRange.from,
            weekEnd: currentRange.to,
            pdf,
            telegramSent: telegramResult.ok,
            telegramError: telegramResult.error
        });

    } catch (error) {
        console.error("❌ Error generando el paquete de reportes semanales:", error);
    }

}
