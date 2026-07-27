import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { InventoryAdjustmentService } from "./inventory-adjustment.service.js";

export class InventoryAdjustmentController {

    private readonly service = new InventoryAdjustmentService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const adjustments = await this.service.findAll();
            res.status(200).json(
                ApiResponse.success(
                    "Ajustes obtenidos correctamente.",
                    adjustments
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
            const adjustment = await this.service.create(req.body);
            res.status(201).json(
                ApiResponse.success(
                    "Ajuste registrado correctamente.",
                    adjustment
                )
            );
        } catch (error) {
            next(error);
        }
    }

}
