import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { MarginProfileService } from "./margin-profile.service.js";

export class MarginProfileController {

    private readonly service = new MarginProfileService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const marginProfiles = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Perfiles de margen obtenidos correctamente.",
                    marginProfiles
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

            const marginProfile = await this.service.findById(id);

            if (!marginProfile) {

                res.status(404).json(
                    ApiResponse.error(
                        "Perfil de margen no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Perfil de margen obtenido correctamente.",
                    marginProfile
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

            const marginProfile = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Perfil de margen creado correctamente.",
                    marginProfile
                )
            );

        } catch (error) {

            next(error);

        }

    }

}