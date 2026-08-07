import { NextFunction, Request, Response } from "express";
import { ProductPriceEntryService } from "./product-price-entry.service.js";
import { ApiResponse } from "../../shared/responses/index.js";

export class ProductPriceEntryController {

    private readonly service = new ProductPriceEntryService();

    async findLabels(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const labels = await this.service.findLabels();
            res.status(200).json(
                ApiResponse.success(
                    "Etiquetas de precio obtenidas correctamente.",
                    labels
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async findByProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params;
            if (!productId || Array.isArray(productId)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Id de producto inválido."
                    )
                );
                return;
            }
            const entries = await this.service.findByProduct(
                productId
            );
            res.status(200).json(
                ApiResponse.success(
                    "Precios obtenidos correctamente.",
                    entries
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async replaceForProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params;
            if (!productId || Array.isArray(productId)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Id de producto inválido."
                    )
                );
                return;
            }
            const entries = await this.service.replaceForProduct(
                productId,
                req.body
            );
            res.status(200).json(
                ApiResponse.success(
                    "Precios guardados correctamente.",
                    entries
                )
            );
        } catch (error) {
            next(error);
        }
    }

}
