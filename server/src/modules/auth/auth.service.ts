import bcrypt from "bcrypt";

import { UnauthorizedError } from "../../shared/errors/index.js";

import { JwtService } from "../../shared/auth/index.js";

import { UserRepository } from "../user/user.repository.js";

import { RefreshTokenRepository } from "./refresh-token.repository.js";

import {
    generateRefreshToken,
    hashRefreshToken
} from "./refresh-token.util.js";

export class AuthService {

    private readonly userRepository = new UserRepository();

    private readonly refreshTokenRepository = new RefreshTokenRepository();

    private buildAuthPayload(
        user: {

            id: bigint;
            username: string;
            firstName: string;
            lastName: string;
            roleId: bigint;
            storeId: bigint;
            role: { name: string };

        }
    ) {

        const accessToken = JwtService.generateToken({

            userId: user.id.toString(),

            username: user.username,

            roleId: user.roleId.toString(),

            roleName: user.role.name,

            storeId: user.storeId.toString()

        });

        return {

            accessToken,

            user: {

                id: user.id.toString(),

                username: user.username,

                firstName: user.firstName,

                lastName: user.lastName,

                roleId: user.roleId.toString(),

                roleName: user.role.name,

                storeId: user.storeId.toString()

            }

        };

    }

    private async issueRefreshToken(
        userId: bigint
    ): Promise<string> {

        const {
            token,
            tokenHash,
            expiresAt
        } = generateRefreshToken();

        await this.refreshTokenRepository.create(
            userId,
            tokenHash,
            expiresAt
        );

        return token;

    }

    async login(

        username: string,

        password: string

    ) {

        const user = await this.userRepository.findByUsername(username);

        if (!user || !user.isActive) {

            throw new UnauthorizedError(
                "Usuario o contraseña incorrectos."
            );

        }

        const validPassword = await bcrypt.compare(

            password,

            user.password

        );

        if (!validPassword) {

            throw new UnauthorizedError(
                "Usuario o contraseña incorrectos."
            );

        }

        const { accessToken, user: authUser } = this.buildAuthPayload(user);

        const refreshToken = await this.issueRefreshToken(user.id);

        return {

            accessToken,

            refreshToken,

            user: authUser

        };

    }

    async refresh(

        rawRefreshToken: string

    ) {

        const tokenHash = hashRefreshToken(rawRefreshToken);

        const stored = await this.refreshTokenRepository.findValidByHash(
            tokenHash
        );

        if (!stored || !stored.user.isActive) {

            throw new UnauthorizedError(
                "Sesión expirada. Inicia sesión nuevamente."
            );

        }

        await this.refreshTokenRepository.revoke(stored.id);

        const { accessToken, user: authUser } = this.buildAuthPayload(
            stored.user
        );

        const refreshToken = await this.issueRefreshToken(stored.user.id);

        return {

            accessToken,

            refreshToken,

            user: authUser

        };

    }

    async logout(

        rawRefreshToken: string

    ): Promise<void> {

        const tokenHash = hashRefreshToken(rawRefreshToken);

        await this.refreshTokenRepository.revokeByHash(tokenHash);

    }

}
