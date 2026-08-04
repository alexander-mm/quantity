import { NextFunction, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

import { PartMovementService } from "./part-movement.service.js";

export class PartMovementController {

    private readonly service = new PartMovementService();

    async findAll(
        _req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const movements = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Movimientos obtenidos correctamente.", movements)
            );

        } catch (error) {

            next(error);

        }

    }

    async findById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const movement = await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success("Movimiento obtenido correctamente.", movement)
            );

        } catch (error) {

            next(error);

        }

    }

    async create(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const body = { ...req.body, userId: req.user!.userId };

            const movement = await this.service.create(body);

            res.status(201).json(
                ApiResponse.success("Movimiento registrado correctamente.", movement)
            );

        } catch (error) {

            next(error);

        }

    }

}
