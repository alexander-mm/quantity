import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { ProductComponentService } from "./product-component.service.js";

export class ProductComponentController {

    private readonly service = new ProductComponentService();

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

            const components = await this.service.findByProduct(productId);

            res.status(200).json(
                ApiResponse.success("Componentes obtenidos correctamente.", components)
            );

        } catch (error) {

            next(error);

        }

    }

    async findProductIdsWithRecipe(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const productIds = await this.service.findProductIdsWithRecipe();

            res.status(200).json(
                ApiResponse.success("Productos con receta obtenidos correctamente.", productIds)
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

            const components = await this.service.set(productId, req.body);

            res.status(200).json(
                ApiResponse.success("Receta guardada correctamente.", components)
            );

        } catch (error) {

            next(error);

        }

    }

}
