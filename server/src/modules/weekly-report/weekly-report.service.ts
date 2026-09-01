import { ReportDataService, type ReportRange } from "../reports/report-data.service.js";
import { buildWeeklyReportPdf } from "../reports/report-pdf.builder.js";
import { TelegramService } from "../../integrations/telegram/telegram.service.js";
import { WeeklyReportRepository } from "./weekly-report.repository.js";
import { ValidationError } from "../../shared/errors/index.js";

function isoDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

// Periodo previo, de la misma duracion, inmediatamente anterior al rango dado.
// Se usa para la seccion de comparacion del PDF cuando el rango no es
// necesariamente una semana calendario (ej. un reporte personalizado).
function getPreviousRangeOfEqualLength(range: ReportRange): ReportRange {

    const durationMs = range.to.getTime() - range.from.getTime();
    const to = new Date(range.from.getTime() - 1);
    const from = new Date(to.getTime() - durationMs);

    return { from, to };

}

export class WeeklyReportService {

    private readonly reportDataService = new ReportDataService();
    private readonly telegramService = new TelegramService();
    private readonly repository = new WeeklyReportRepository();

    async generateForRange(
        range: ReportRange,
        options: {
            sendToTelegram: boolean;
            pdfOptions?: Parameters<typeof buildWeeklyReportPdf>[2];
            telegramCaption?: string;
        }
    ) {

        if (range.from > range.to) {
            throw new ValidationError("La fecha inicial no puede ser posterior a la fecha final.");
        }

        const previousRange = getPreviousRangeOfEqualLength(range);

        const [currentData, previousData] = await Promise.all([
            this.reportDataService.getReportData(range),
            this.reportDataService.getReportData(previousRange)
        ]);

        const pdf = await buildWeeklyReportPdf(currentData, previousData, options.pdfOptions);

        let telegramSent = false;
        let telegramError: string | undefined;

        if (options.sendToTelegram) {

            const result = await this.telegramService.sendDocument(
                pdf,
                `reporte-${isoDate(range.from)}.pdf`,
                options.telegramCaption
            );

            telegramSent = result.ok;
            telegramError = result.error;

        }

        return this.repository.create({
            weekStart: range.from,
            weekEnd: range.to,
            pdf,
            telegramSent,
            telegramError
        });

    }

}
