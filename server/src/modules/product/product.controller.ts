import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { ProductService } from "./product.service.js";

export class ProductController {

    private readonly service = new ProductService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const products = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Productos obtenidos correctamente.",
                    products
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async findById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { id } = req.params;

            if (!id || Array.isArray(id)) {

                res.status(400).json(
                    ApiResponse.error("Id inválido.")
                );

                return;

            }

            const product = await this.service.findById(id);

            if (!product) {

                res.status(404).json(
                    ApiResponse.error(
                        "Producto no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Producto obtenido correctamente.",
                    product
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const body = {

                ...req.body,

                brandId: BigInt(req.body.brandId),

                categoryId: BigInt(req.body.categoryId),

                unitOfMeasureId: BigInt(req.body.unitOfMeasureId),

                marginProfileId: BigInt(req.body.marginProfileId)

            };

            const product =
                await this.service.create(body);

            res.status(201).json(
                ApiResponse.success(
                    "Producto creado correctamente.",
                    product
                )
            );

        } catch (error) {

            next(error);

        }

    }

}