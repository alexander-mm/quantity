import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { InventoryStockService } from "./inventory-stock.service.js";

export class InventoryStockController {

    private readonly service = new InventoryStockService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const stock = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Inventario obtenido correctamente.",
                    stock
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
                    ApiResponse.error(
                        "Id inválido."
                    )
                );

                return;

            }

            const stock = await this.service.findById(id);

            if (!stock) {

                res.status(404).json(
                    ApiResponse.error(
                        "Registro de inventario no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Registro obtenido correctamente.",
                    stock
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
                        "Producto inválido."
                    )
                );

                return;

            }

            const stock = await this.service.findByProduct(productId);

            res.status(200).json(
                ApiResponse.success(
                    "Inventario obtenido correctamente.",
                    stock
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async findByStore(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { storeId } = req.params;

            if (!storeId || Array.isArray(storeId)) {

                res.status(400).json(
                    ApiResponse.error(
                        "Tienda inválida."
                    )
                );

                return;

            }

            const stock = await this.service.findByStore(storeId);

            res.status(200).json(
                ApiResponse.success(
                    "Inventario obtenido correctamente.",
                    stock
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async findLowStock(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const stock = await this.service.findLowStock();

            res.status(200).json(
                ApiResponse.success(
                    "Productos con bajo inventario obtenidos correctamente.",
                    stock
                )
            );

        } catch (error) {

            next(error);

        }

    }

}