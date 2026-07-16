import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { InventoryMovementService } from "./inventory-movement.service.js";

export class InventoryMovementController {

    private readonly service = new InventoryMovementService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const movements = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Movimientos obtenidos correctamente.",
                    movements
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

            const movement = await this.service.findById(id);

            if (!movement) {

                res.status(404).json(
                    ApiResponse.error(
                        "Movimiento no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Movimiento obtenido correctamente.",
                    movement
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

            const movement = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Movimiento registrado correctamente.",
                    movement
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async getKardex(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {

        const { productId, storeId } = req.params;

        if (
            !productId ||
            !storeId ||
            Array.isArray(productId) ||
            Array.isArray(storeId)
        ) {

            res.status(400).json(
                ApiResponse.error(
                    "Parámetros inválidos."
                )
            );

            return;

        }

        const kardex = await this.service.getKardex(
            productId,
            storeId
        );

        res.status(200).json(
            ApiResponse.success(
                "Kardex obtenido correctamente.",
                kardex
            )
        );

    } catch (error) {

        next(error);

    }

}

}