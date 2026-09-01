import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { WeeklyReportRepository } from "./weekly-report.repository.js";

export class WeeklyReportController {

    private readonly repository = new WeeklyReportRepository();

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
