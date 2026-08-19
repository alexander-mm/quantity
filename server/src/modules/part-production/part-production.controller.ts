import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { PartProductionService } from "./part-production.service.js";

export class PartProductionController {

    private readonly service = new PartProductionService();

    async preview(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { partId } = req.params;
            const quantity = Number(req.query.quantity ?? 1);

            if (!partId || Array.isArray(partId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            if (!quantity || quantity <= 0) {
                res.status(400).json(ApiResponse.error("Cantidad inválida."));
                return;
            }

            const preview = await this.service.preview(partId, quantity);

            res.status(200).json(
                ApiResponse.success("Cálculo de producción obtenido correctamente.", preview)
            );

        } catch (error) {

            next(error);

        }

    }

}
