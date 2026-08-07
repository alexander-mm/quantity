import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { EquipmentPartService } from "./equipment-part.service.js";

export class EquipmentPartController {

    private readonly service = new EquipmentPartService();

    async findByProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { productId } = req.params;

            if (!productId || Array.isArray(productId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const parts = await this.service.findByProduct(productId);

            res.status(200).json(
                ApiResponse.success("Piezas del equipo obtenidas correctamente.", parts)
            );

        } catch (error) {

            next(error);

        }

    }

    async preview(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { productId } = req.params;
            const quantity = Number(req.query.quantity ?? 1);

            if (!productId || Array.isArray(productId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            if (!quantity || quantity <= 0) {
                res.status(400).json(ApiResponse.error("Cantidad inválida."));
                return;
            }

            const preview = await this.service.preview(productId, quantity);

            res.status(200).json(
                ApiResponse.success("Cálculo de material obtenido correctamente.", preview)
            );

        } catch (error) {

            next(error);

        }

    }

    async set(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { productId } = req.params;

            if (!productId || Array.isArray(productId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const parts = await this.service.set(productId, req.body);

            res.status(200).json(
                ApiResponse.success("Receta de piezas guardada correctamente.", parts)
            );

        } catch (error) {

            next(error);

        }

    }

}
