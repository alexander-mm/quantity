import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";

type RawMaterialAdjustmentWithRelations =
    Prisma.RawMaterialMovementGetPayload<{
        include: {
            user: { select: typeof safeUserSelect };
            details: {
                include: {
                    rawMaterial: true;
                };
            };
        };
    }>;

export class RawMaterialAdjustmentRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<RawMaterialAdjustmentWithRelations[]> {

        return this.prisma.rawMaterialMovement.findMany({

            where: {
                isAdjustment: true
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        rawMaterial: true
                    }
                }
            },

            orderBy: {
                movementDate: "desc"
            }

        });

    }

}
