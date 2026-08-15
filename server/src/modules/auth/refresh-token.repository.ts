import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class RefreshTokenRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async create(
        userId: bigint,
        tokenHash: string,
        expiresAt: Date
    ) {

        return this.prisma.refreshToken.create({

            data: {
                userId,
                tokenHash,
                expiresAt
            }

        });

    }

    async findValidByHash(
        tokenHash: string
    ) {

        return this.prisma.refreshToken.findFirst({

            where: {

                tokenHash,

                revokedAt: null,

                expiresAt: {
                    gt: this.getCurrentDate()
                }

            },

            include: {

                user: {
                    include: {
                        role: true,
                        store: true
                    }
                }

            }

        });

    }

    async revoke(
        id: bigint
    ) {

        return this.prisma.refreshToken.update({

            where: {
                id
            },

            data: {
                revokedAt: this.getCurrentDate()
            }

        });

    }

    async revokeByHash(
        tokenHash: string
    ) {

        return this.prisma.refreshToken.updateMany({

            where: {
                tokenHash,
                revokedAt: null
            },

            data: {
                revokedAt: this.getCurrentDate()
            }

        });

    }

}
