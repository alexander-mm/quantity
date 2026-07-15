import { NextFunction, Request, Response } from "express";

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

    console.error(error);

    res
        .status(500)
        .json(
            ApiResponse.error(
                "Error interno del servidor."
            )
        );

}