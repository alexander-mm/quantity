import { Request, Response } from "express";

import { AuthService } from "../services/AuthService.js";
import { JwtService } from "../services/JwtService.js";

export class AuthController {

    private readonly authService = new AuthService();

    private readonly jwtService = new JwtService();

    async login(req: Request, res: Response): Promise<void> {

        const { username, password } = req.body;

        const user = await this.authService.login(
            username,
            password
        );

        if (!user) {

            res.status(401).json({
                success: false,
                message: "Usuario o contraseña incorrectos."
            });

            return;

        }

        const token = this.jwtService.generateToken({
            userId: user.id,
            username: user.username,
            roleId: user.roleId,
            storeId: user.storeId
        });

        res.status(200).json({

            success: true,

            token,

            user: {

                id: user.id,

                username: user.username,

                firstName: user.firstName,

                lastName: user.lastName,

                roleId: user.roleId,

                storeId: user.storeId

            }

        });

    }

}