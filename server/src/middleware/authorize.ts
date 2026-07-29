import { NextFunction, Response } from "express";

import { ApiResponse } from "../shared/responses/index.js";
import { AuthenticatedRequest } from "./authenticate.js";

export function authorize(...allowedRoles: string[]) {

    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): void => {

        if (!req.user) {

            res.status(401).json(
                ApiResponse.error(
                    "Token no proporcionado."
                )
            );

            return;

        }

        if (!allowedRoles.includes(req.user.roleName)) {

            res.status(403).json(
                ApiResponse.error(
                    "No tienes permisos para realizar esta acción."
                )
            );

            return;

        }

        next();

    };

}
