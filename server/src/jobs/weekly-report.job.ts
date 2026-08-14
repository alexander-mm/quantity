import { ReportDataService, type ReportRange } from "../modules/reports/report-data.service.js";
import { buildSalesReportPdf, buildMoneyReportPdf, buildComparisonReportPdf } from "../modules/reports/report-pdf.builder.js";
import { TelegramService } from "../integrations/telegram/telegram.service.js";

const reportDataService = new ReportDataService();
const telegramService = new TelegramService();

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

        const [salesPdf, moneyPdf, comparisonPdf] = await Promise.all([
            buildSalesReportPdf(currentData),
            buildMoneyReportPdf(currentData),
            buildComparisonReportPdf(currentData, previousData)
        ]);

        const label = `${isoDate(currentRange.from)} a ${isoDate(currentRange.to)}`;

        await telegramService.sendMessage(`📊 <b>Reportes semanales</b> (${label})`);
        await telegramService.sendDocument(salesPdf, `reporte-ventas-${isoDate(currentRange.from)}.pdf`, "Reporte de ventas");
        await telegramService.sendDocument(moneyPdf, `reporte-dinero-${isoDate(currentRange.from)}.pdf`, "Reporte de dinero");
        await telegramService.sendDocument(comparisonPdf, `comparacion-semanal-${isoDate(currentRange.from)}.pdf`, "Comparación con la semana anterior");

    } catch (error) {
        console.error("❌ Error generando el paquete de reportes semanales:", error);
    }

}
