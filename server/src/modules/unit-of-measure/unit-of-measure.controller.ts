import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { UnitOfMeasureService } from "./unit-of-measure.service.js";

export class UnitOfMeasureController {

    private readonly service = new UnitOfMeasureService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const units = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Unidades de medida obtenidas correctamente.",
                    units
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

            const unit = await this.service.findById(id);

            if (!unit) {

                res.status(404).json(
                    ApiResponse.error(
                        "Unidad de medida no encontrada."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Unidad de medida obtenida correctamente.",
                    unit
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

            const unit = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Unidad de medida creada correctamente.",
                    unit
                )
            );

        } catch (error) {

            next(error);

        }

    }

}