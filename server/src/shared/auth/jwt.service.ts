import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

export interface JwtPayload {

    userId: string;

    username: string;

    roleId: string;

}

export class JwtService {

    static generateToken(

        payload: JwtPayload

    ): string {

        return jwt.sign(
            payload,
            env.jwtSecret,
            {
                expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
            }
        );

    }

    static verifyToken(

        token: string

    ): JwtPayload {

        return jwt.verify(

            token,

            env.jwtSecret

        ) as JwtPayload;

    }

}