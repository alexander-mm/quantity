import { RawMaterialMovement, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
import { CreateRawMaterialMovementDto } from "./raw-material-movement.dto.js";

type RawMaterialMovementWithRelations =
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

export class RawMaterialMovementRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<RawMaterialMovementWithRelations[]> {

        return this.prisma.rawMaterialMovement.findMany({

            orderBy: {
                id: "desc"
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        rawMaterial: true
                    }
                }
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<RawMaterialMovementWithRelations | null> {

        return this.prisma.rawMaterialMovement.findUnique({

            where: {
                id
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        rawMaterial: true
                    }
                }
            }

        });

    }

    async findByNumber(
        number: string
    ): Promise<RawMaterialMovement | null> {

        return this.prisma.rawMaterialMovement.findUnique({

            where: {
                number
            }

        });

    }

    async create(
        data: CreateRawMaterialMovementDto
    ): Promise<RawMaterialMovementWithRelations> {

        return this.prisma.rawMaterialMovement.create({

            data: {
                number: data.number,
                type: data.type,
                userId: BigInt(data.userId),
                cuttingOrderId: data.cuttingOrderId ? BigInt(data.cuttingOrderId) : undefined,
                movementDate: data.movementDate,
                observations: data.observations,
                isAdjustment: data.isAdjustment ?? false,
                details: {
                    create: data.details.map(item => ({
                        rawMaterialId: BigInt(item.rawMaterialId),
                        quantity: item.quantity
                    }))
                }
            },

            include: {
                user: { select: safeUserSelect },
                details: {
                    include: {
                        rawMaterial: true
                    }
                }
            }

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): RawMaterialMovementRepository {

        return new RawMaterialMovementRepository(tx);

    }

}
