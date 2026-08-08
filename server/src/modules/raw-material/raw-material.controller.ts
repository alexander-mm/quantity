import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

import { RawMaterialService } from "./raw-material.service.js";

export class RawMaterialController {

    private readonly service = new RawMaterialService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const rawMaterials = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Materias primas obtenidas correctamente.", rawMaterials)
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

            const rawMaterials = await this.service.findLowStock();

            res.status(200).json(
                ApiResponse.success("Materias primas con stock bajo obtenidas correctamente.", rawMaterials)
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

            const rawMaterials = await this.service.findMediumStock();

            res.status(200).json(
                ApiResponse.success("Materias primas con stock medio obtenidas correctamente.", rawMaterials)
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

            const rawMaterial = await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success("Materia prima obtenida correctamente.", rawMaterial)
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

            const rawMaterial = await this.service.create(body);

            res.status(201).json(
                ApiResponse.success("Materia prima creada correctamente.", rawMaterial)
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

            const rawMaterial = await this.service.update(id, req.body);

            res.status(200).json(
                ApiResponse.success("Materia prima actualizada correctamente.", rawMaterial)
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

            const rawMaterial = await this.service.updateMinimumStock(id, req.body.minimumStock);

            res.status(200).json(
                ApiResponse.success("Stock mínimo actualizado correctamente.", rawMaterial)
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
                ApiResponse.success("Materia prima eliminada correctamente.")
            );

        } catch (error) {

            next(error);

        }

    }

}
