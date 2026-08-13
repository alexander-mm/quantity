import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { PartComponentProductService } from "./part-component-product.service.js";

export class PartComponentProductController {

    private readonly service = new PartComponentProductService();

    async findByPart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { partId } = req.params;

            if (!partId || Array.isArray(partId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const products = await this.service.findByPart(partId);

            res.status(200).json(
                ApiResponse.success("Productos del componente obtenidos correctamente.", products)
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

            const { partId } = req.params;

            if (!partId || Array.isArray(partId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const products = await this.service.set(partId, req.body);

            res.status(200).json(
                ApiResponse.success("Receta de productos guardada correctamente.", products)
            );

        } catch (error) {

            next(error);

        }

    }

}