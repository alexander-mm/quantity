import { NextFunction, Request, Response } from "express";

import { CategoryService } from "./category.service.js";

import { ApiResponse } from "../../shared/responses/index.js";

export class CategoryController {

    private readonly service = new CategoryService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const categories = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Categorías obtenidas correctamente.",
                    categories
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

            const category = await this.service.findById(id);

            if (!category) {

                res.status(404).json(
                    ApiResponse.error(
                        "Categoría no encontrada."
                    )
                );

                return;
            }
            res.status(200).json(
                ApiResponse.success(
                    "Categoría obtenida correctamente.",
                    category
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
            const category = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Categoría creada correctamente.",
                    category
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
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }

            const category = await this.service.update(id, req.body);

            res.status(200).json(
                ApiResponse.success(
                    "Categoría actualizada correctamente.",
                    category
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
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }

            await this.service.delete(id);

            res.status(200).json(
                ApiResponse.success(
                    "Categoría eliminada correctamente."
                )
            );
        } catch (error) {
            next(error);
        }
    }
}