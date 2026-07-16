import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { RoleService } from "./role.service.js";

export class RoleController {

    private readonly service = new RoleService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const roles = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Roles obtenidos correctamente.",
                    roles
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

            const role = await this.service.findById(id);

            if (!role) {

                res.status(404).json(
                    ApiResponse.error(
                        "Rol no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Rol obtenido correctamente.",
                    role
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

            const role = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Rol creado correctamente.",
                    role
                )
            );

        } catch (error) {

            next(error);

        }

    }

}