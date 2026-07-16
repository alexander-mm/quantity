import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { MovementTypeService } from "./movement-type.service.js";

export class MovementTypeController {

    private readonly service = new MovementTypeService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const movementTypes = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Tipos de movimiento obtenidos correctamente.",
                    movementTypes
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

            const movementType = await this.service.findById(id);

            if (!movementType) {

                res.status(404).json(
                    ApiResponse.error(
                        "Tipo de movimiento no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Tipo de movimiento obtenido correctamente.",
                    movementType
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

            const movementType = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Tipo de movimiento creado correctamente.",
                    movementType
                )
            );

        } catch (error) {

            next(error);

        }

    }

}