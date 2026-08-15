import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";

type PartAdjustmentWithRelations =
    Prisma.PartMovementGetPayload<{
        include: {
            user: { select: typeof safeUserSelect };
            details: {
                include: {
                    part: true;
                };
            };
        };
    }>;

export class PartAdjustmentRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<PartAdjustmentWithRelations[]> {

        return this.prisma.partMovement.findMany({

            where: {
                isAdjustment: true
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        part: true
                    }
                }
            },

            orderBy: {
                movementDate: "desc"
            }

        });

    }

}
