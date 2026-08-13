import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { PartComponentService } from "./part-component.service.js";

export class PartComponentController {

    private readonly service = new PartComponentService();

    async findByPart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { partId } = req.params;

            if (!partId || Array.isArray(partId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const components = await this.service.findByPart(partId);

            res.status(200).json(
                ApiResponse.success("Componentes obtenidos correctamente.", components)
            );

        } catch (error) {

            next(error);

        }

    }

    async findPartIdsWithRecipe(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const partIds = await this.service.findPartIdsWithRecipe();

            res.status(200).json(
                ApiResponse.success("Piezas con receta obtenidas correctamente.", partIds)
            );

        } catch (error) {

            next(error);

        }

    }

    async set(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { partId } = req.params;

            if (!partId || Array.isArray(partId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const components = await this.service.set(partId, req.body);

            res.status(200).json(
                ApiResponse.success("Receta guardada correctamente.", components)
            );

        } catch (error) {

            next(error);

        }

    }

}