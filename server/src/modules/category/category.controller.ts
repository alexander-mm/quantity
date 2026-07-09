import { Request, Response } from "express";

import { CategoryService } from "./category.service.js";

import { toJSON } from "../../shared/utils/json.js";

export class CategoryController {

    private readonly service = new CategoryService();

    async findAll(
        _req: Request,
        res: Response
    ): Promise<void> {

        try {

            const categories = await this.service.findAll();

            res.status(200).json({

                success: true,

                message: "Categorías obtenidas correctamente.",

                data: toJSON(categories)

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: "Error interno del servidor."

            });

        }

    }

    async findById(
        req: Request,
        res: Response
    ): Promise<void> {

        try {

            const { id } = req.params;

            if (!id || Array.isArray(id)) {

                res.status(400).json({

                    success: false,

                    message: "Id inválido."

                });

                return;

            }

            const category = await this.service.findById(id);

            if (!category) {

                res.status(404).json({

                    success: false,

                    message: "Categoría no encontrada."

                });

                return;

            }

            res.status(200).json({

                success: true,

                message: "Categoría obtenida correctamente.",

                data: toJSON(category)

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: "Error interno del servidor."

            });

        }

    }

    async create(
        req: Request,
        res: Response
    ): Promise<void> {

        try {

            const category = await this.service.create(req.body);

            res.status(201).json({

                success: true,

                message: "Categoría creada correctamente.",

                data: toJSON(category)

            });

        } catch (error) {

            console.error(error);

            if (
                error instanceof Error &&
                error.message === "CATEGORY_ALREADY_EXISTS"
            ) {

                res.status(409).json({

                    success: false,

                    message: "Ya existe una categoría con ese nombre."

                });

                return;

            }

            res.status(500).json({

                success: false,

                message: "Error interno del servidor."

            });

        }

    }

}