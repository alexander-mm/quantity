import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { ClientService } from "./client.service.js";

export class ClientController {

    private readonly service = new ClientService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const clients = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Clientes obtenidos correctamente.",
                    clients
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

            const client = await this.service.findById(id);

            if (!client) {

                res.status(404).json(
                    ApiResponse.error(
                        "Cliente no encontrado."
                    )
                );

                return;

            }

            res.status(200).json(
                ApiResponse.success(
                    "Cliente obtenido correctamente.",
                    client
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

            const client = await this.service.create(req.body);

            res.status(201).json(
                ApiResponse.success(
                    "Cliente creado correctamente.",
                    client
                )
            );

        } catch (error) {

            next(error);

        }

    }

}
