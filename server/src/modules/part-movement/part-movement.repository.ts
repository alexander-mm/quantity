import { PartMovement, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
import { CreatePartMovementDto } from "./part-movement.dto.js";

type PartMovementWithRelations =
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

export class PartMovementRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<PartMovementWithRelations[]> {

        return this.prisma.partMovement.findMany({

            orderBy: {
                movementDate: "desc"
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        part: true
                    }
                }
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<PartMovementWithRelations | null> {

        return this.prisma.partMovement.findUnique({

            where: {
                id
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        part: true
                    }
                }
            }

        });

    }

    async findByNumber(
        number: string
    ): Promise<PartMovement | null> {

        return this.prisma.partMovement.findUnique({

            where: {
                number
            }

        });

    }

    async create(
        data: CreatePartMovementDto
    ): Promise<PartMovementWithRelations> {

        return this.prisma.partMovement.create({

            data: {
                number: data.number,
                type: data.type,
                userId: BigInt(data.userId),
                cuttingOrderId: data.cuttingOrderId ? BigInt(data.cuttingOrderId) : undefined,
                movementDate: data.movementDate,
                observations: data.observations,
                details: {
                    create: data.details.map(item => ({
                        partId: BigInt(item.partId),
                        quantity: item.quantity
                    }))
                }
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        part: true
                    }
                }
            }

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): PartMovementRepository {

        return new PartMovementRepository(tx);

    }

}
