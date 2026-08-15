import { NextFunction, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { PartAdjustmentService } from "./part-adjustment.service.js";

export class PartAdjustmentController {

    private readonly service = new PartAdjustmentService();

    async findAll(
        _req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const adjustments = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Ajustes obtenidos correctamente.", adjustments)
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

            const adjustment = await this.service.create(body);

            res.status(201).json(
                ApiResponse.success("Ajuste registrado correctamente.", adjustment)
            );

        } catch (error) {

            next(error);

        }

    }

}
