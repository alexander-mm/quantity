import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { AuthService } from "./auth.service.js";

export class AuthController {

    private readonly service = new AuthService();

    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { username, password } = req.body;

            const result = await this.service.login(

                username,

                password

            );

            res.status(200).json(

                ApiResponse.success(

                    "Inicio de sesión correcto.",

                    result

                )

            );

        } catch (error) {

            next(error);

        }

    }

    async refresh(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { refreshToken } = req.body;

            const result = await this.service.refresh(refreshToken);

            res.status(200).json(

                ApiResponse.success(

                    "Sesión renovada.",

                    result

                )

            );

        } catch (error) {

            next(error);

        }

    }

    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { refreshToken } = req.body;

            await this.service.logout(refreshToken);

            res.status(200).json(

                ApiResponse.success(
                    "Sesión cerrada."
                )

            );

        } catch (error) {

            next(error);

        }

    }

}
