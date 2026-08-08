import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

import { PartService } from "./part.service.js";

export class PartController {

    private readonly service = new PartService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const parts = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Piezas obtenidas correctamente.", parts)
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

            const parts = await this.service.findLowStock();

            res.status(200).json(
                ApiResponse.success("Piezas con stock bajo obtenidas correctamente.", parts)
            );

        } catch (error) {

            next(error);

        }

    }

    async findMediumStock(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const parts = await this.service.findMediumStock();

            res.status(200).json(
                ApiResponse.success("Piezas con stock medio obtenidas correctamente.", parts)
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

            const part = await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success("Pieza obtenida correctamente.", part)
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

            const part = await this.service.create(body);

            res.status(201).json(
                ApiResponse.success("Pieza creada correctamente.", part)
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
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const part = await this.service.update(id, req.body);

            res.status(200).json(
                ApiResponse.success("Pieza actualizada correctamente.", part)
            );

        } catch (error) {

            next(error);

        }

    }

    async updateMinimumStock(
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

            const part = await this.service.updateMinimumStock(id, req.body.minimumStock);

            res.status(200).json(
                ApiResponse.success("Stock mínimo actualizado correctamente.", part)
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
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            await this.service.delete(id);

            res.status(200).json(
                ApiResponse.success("Pieza eliminada correctamente.")
            );

        } catch (error) {

            next(error);

        }

    }

}
