import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { PartRecipeService } from "./part-recipe.service.js";

export class PartRecipeController {

    private readonly service = new PartRecipeService();

    async findByPart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { partId } = req.params;

            if (!partId || Array.isArray(partId)) {
                res.status(400).json(ApiResponse.error("Id de pieza inválido."));
                return;
            }

            const recipe = await this.service.findByPart(partId);

            res.status(200).json(
                ApiResponse.success("Receta de corte obtenida correctamente.", recipe)
            );

        } catch (error) {

            next(error);

        }

    }

    async remove(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { partId } = req.params;

            if (!partId || Array.isArray(partId)) {
                res.status(400).json(ApiResponse.error("Id de pieza inválido."));
                return;
            }

            await this.service.remove(partId);

            res.status(200).json(
                ApiResponse.success("Receta de corte eliminada correctamente.", null)
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
                res.status(400).json(ApiResponse.error("Id de pieza inválido."));
                return;
            }

            const recipe = await this.service.set(partId, req.body);

            res.status(200).json(
                ApiResponse.success("Receta de corte guardada correctamente.", recipe)
            );

        } catch (error) {

            next(error);

        }

    }

}
