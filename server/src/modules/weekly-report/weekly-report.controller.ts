import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { WeeklyReportRepository } from "./weekly-report.repository.js";
import { WeeklyReportService } from "./weekly-report.service.js";

export class WeeklyReportController {

    private readonly repository = new WeeklyReportRepository();
    private readonly service = new WeeklyReportService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const reports = await this.repository.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Informes semanales obtenidos correctamente.",
                    reports
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async generateCustom(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { from, to } = req.body as { from: Date; to: Date };

            const range = {
                from: new Date(new Date(from).setHours(0, 0, 0, 0)),
                to: new Date(new Date(to).setHours(23, 59, 59, 999))
            };

            const report = await this.service.generateForRange(range, {
                sendToTelegram: false,
                pdfOptions: {
                    title: "Reporte Personalizado",
                    comparisonTitle: "3. Comparación con el período anterior",
                    currentPeriodLabel: "Período actual",
                    previousPeriodLabel: "Período anterior"
                }
            });

            res.status(201).json(
                ApiResponse.success(
                    "Informe generado correctamente.",
                    report
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async downloadPdf(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                throw new ValidationError("Id inválido.");
            }

            const report = await this.repository.findPdfById(BigInt(id));

            if (!report) {
                throw new NotFoundError("Informe no encontrado.");
            }

            const isoDate = report.weekStart.toISOString().split("T")[0];

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="reporte-semanal-${isoDate}.pdf"`);
            res.send(Buffer.from(report.pdf));

        } catch (error) {
            next(error);
        }

    }

}
