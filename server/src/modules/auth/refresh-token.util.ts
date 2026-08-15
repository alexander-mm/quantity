import { randomBytes, createHash } from "node:crypto";

import { env } from "../../config/env.js";

export interface GeneratedRefreshToken {

    token: string;

    tokenHash: string;

    expiresAt: Date;

}

export function hashRefreshToken(
    token: string
): string {

    return createHash("sha256")
        .update(token)
        .digest("hex");

}

export function generateRefreshToken(): GeneratedRefreshToken {

    const token = randomBytes(48).toString("hex");

    const expiresAt = new Date(

        Date.now() +
        env.refreshTokenExpiresDays * 24 * 60 * 60 * 1000

    );

    return {

        token,

        tokenHash: hashRefreshToken(token),

        expiresAt

    };

}
