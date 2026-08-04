import { NextFunction, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

import { ProductAssemblyService } from "./product-assembly.service.js";

export class ProductAssemblyController {

    private readonly service = new ProductAssemblyService();

    async findAll(
        _req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const assemblies = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Ensamblajes obtenidos correctamente.", assemblies)
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

            const assembly = await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success("Ensamblaje obtenido correctamente.", assembly)
            );

        } catch (error) {

            next(error);

        }

    }

    async preview(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { productId } = req.params;
            const quantity = Number(req.query.quantity ?? 1);

            if (!productId || Array.isArray(productId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            if (!quantity || quantity <= 0) {
                res.status(400).json(ApiResponse.error("Cantidad inválida."));
                return;
            }

            const preview = await this.service.preview(productId, quantity);

            res.status(200).json(
                ApiResponse.success("Vista previa obtenida correctamente.", preview)
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

            const assembly = await this.service.create(body);

            res.status(201).json(
                ApiResponse.success("Ensamblaje registrado como borrador.", assembly)
            );

        } catch (error) {

            next(error);

        }

    }

    async update(
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

            const assembly = await this.service.update(id, req.body);

            res.status(200).json(
                ApiResponse.success("Ensamblaje actualizado correctamente.", assembly)
            );

        } catch (error) {

            next(error);

        }

    }

    async confirm(
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

            const assembly = await this.service.confirm(id, req.user!.userId);

            res.status(200).json(
                ApiResponse.success("Ensamblaje confirmado: inventario actualizado.", assembly)
            );

        } catch (error) {

            next(error);

        }

    }

    async delete(
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

            await this.service.cancel(id);

            res.status(200).json(
                ApiResponse.success("Ensamblaje eliminado correctamente.")
            );

        } catch (error) {

            next(error);

        }

    }

}
