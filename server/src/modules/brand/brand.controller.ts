import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { BrandService } from "./brand.service.js";

export class BrandController {

    private readonly service = new BrandService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const brands = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Marcas obtenidas correctamente.",
                    brands
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

            const brand = await this.service.findById(id);

            if (!brand) {

                res.status(404).json(
                    ApiResponse.error(
                        "Marca no encontrada."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Marca obtenida correctamente.",
                    brand
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

            const brand = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Marca creada correctamente.",
                    brand
                )
            );

        } catch (error) {

            next(error);

        }

    }

}