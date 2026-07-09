import jwt from "jsonwebtoken";

export interface JwtPayload {

    userId: bigint;

    username: string;

    roleId: bigint;

    storeId: bigint;

}

export class JwtService {

    generateToken(payload: JwtPayload): string {

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured.");
        }

        return jwt.sign(payload, secret, {
            expiresIn: "8h"
        });

    }

    verifyToken(token: string): JwtPayload {

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured.");
        }

        return jwt.verify(token, secret) as JwtPayload;

    }

}