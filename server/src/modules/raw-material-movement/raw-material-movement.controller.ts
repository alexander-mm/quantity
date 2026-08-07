import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

import { RawMaterialMovementService } from "./raw-material-movement.service.js";

export class RawMaterialMovementController {

    private readonly service = new RawMaterialMovementService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const movements = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Movimientos de materia prima obtenidos correctamente.", movements)
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
