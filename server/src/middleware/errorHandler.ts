import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ApiResponse } from "../shared/responses/index.js";
import { AppError } from "../shared/errors/index.js";

export function errorHandler(

    error: unknown,

    _req: Request,

    res: Response,

    _next: NextFunction

): void {

    if (error instanceof AppError) {

        res
            .status(error.statusCode)
            .json(
                ApiResponse.error(error.message)
            );
        return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002":
                res
                    .status(409)
                    .json(
                        ApiResponse.error(
                            "Ya existe un registro con esos datos."
                        )
                    );
                return;
            case "P2025":
                res
                    .status(404)
                    .json(
                        ApiResponse.error(
                            "Registro no encontrado."
                        )
                    );
                return;
            case "P2003":
                res
                    .status(409)
                    .json(
                        ApiResponse.error(
                            "No es posible realizar la operación porque existen registros relacionados."
                        )
                    );
                return;
        }
    }

    console.error(error);

    res
        .status(500)
        .json(
            ApiResponse.error(
                "Error interno del servidor."
            )
        );

}