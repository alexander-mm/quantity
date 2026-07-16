import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { UserService } from "./user.service.js";

export class UserController {

    private readonly service = new UserService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const users = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Usuarios obtenidos correctamente.",
                    users
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

            const user = await this.service.findById(id);

            if (!user) {

                res.status(404).json(
                    ApiResponse.error(
                        "Usuario no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Usuario obtenido correctamente.",
                    user
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

            const body = {

                ...req.body,

                roleId: BigInt(req.body.roleId),

                storeId: BigInt(req.body.storeId)

            };

            const user = await this.service.create(body);

            res.status(201).json(
                ApiResponse.success(
                    "Usuario creado correctamente.",
                    user
                )
            );

        } catch (error) {

            next(error);

        }

    }

}
