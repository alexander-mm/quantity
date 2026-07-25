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

    async update(
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

            const movementType =
                await this.service.update(
                    id,
                    req.body
                );

            res.status(200).json(
                ApiResponse.success(
                    "Tipo de movimiento actualizado correctamente.",
                    movementType
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async delete(
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

            await this.service.delete(id);

            res.status(200).json(
                ApiResponse.success(
                    "Tipo de movimiento eliminado correctamente."
                )
            );

        } catch (error) {

            next(error);

        }

    }

}