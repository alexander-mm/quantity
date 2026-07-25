import { NextFunction, Request, Response } from "express";
import { ProductPriceService } from "./product-price.service.js";
import { ApiResponse } from "../../shared/responses/index.js";

export class ProductPriceController {

    private readonly service = new ProductPriceService();

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
            const prices = await this.service.findByProduct(
                productId
            );
            res.status(200).json(
                ApiResponse.success(
                    "Precios obtenidos correctamente.",
                    prices
                )
            );
        } catch (error) {
            next(error);
        }
    }

}
