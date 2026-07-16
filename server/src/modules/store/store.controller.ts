import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { StoreService } from "./store.service.js";

export class StoreController {

    private readonly service = new StoreService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const stores = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Tiendas obtenidas correctamente.",
                    stores
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

            const store = await this.service.findById(id);

            if (!store) {

                res.status(404).json(
                    ApiResponse.error(
                        "Tienda no encontrada."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Tienda obtenida correctamente.",
                    store
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

            const store = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Tienda creada correctamente.",
                    store
                )
            );

        } catch (error) {

            next(error);

        }

    }

}
