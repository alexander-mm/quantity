import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../shared/responses/index.js";
import { JwtService } from "../shared/auth/index.js";

export interface AuthenticatedRequest extends Request {

    user?: {

        userId: string;

        username: string;

        roleId: string;

    };

}

export function authenticate(

    req: AuthenticatedRequest,

    res: Response,

    next: NextFunction

): void {

    const authorization = req.headers.authorization;

    if (!authorization) {

        res.status(401).json(

            ApiResponse.error(

                "Token no proporcionado."

            )

        );

        return;

    }

    const token = authorization.replace(

        "Bearer ",

        ""

    );

    try {

        req.user = JwtService.verifyToken(token);

        next();

    }

    catch {

        res.status(401).json(

            ApiResponse.error(

                "Token inválido."

            )

        );

    }

}
