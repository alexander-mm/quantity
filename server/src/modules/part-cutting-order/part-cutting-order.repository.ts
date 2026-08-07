import { PartCuttingOrder, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
import { CreatePartCuttingOrderDto, UpdatePartCuttingOrderDto } from "./part-cutting-order.dto.js";

type PartCuttingOrderWithRelations =
    Prisma.PartCuttingOrderGetPayload<{
        include: {
            part: true;
            rawMaterial: true;
            user: { select: typeof safeUserSelect };
        };
    }>;

export class PartCuttingOrderRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    private readonly include = {
        part: true,
        rawMaterial: true,
        user: { select: safeUserSelect }
    } as const;

    async findAll(): Promise<PartCuttingOrderWithRelations[]> {

        return this.prisma.partCuttingOrder.findMany({

            orderBy: {
                cuttingDate: "desc"
            },

            include: this.include

        });

    }

    async findById(
        id: bigint
    ): Promise<PartCuttingOrderWithRelations | null> {

        return this.prisma.partCuttingOrder.findUnique({

            where: {
                id
            },

            include: this.include

        });

    }

    async findByNumber(
        number: string
    ): Promise<PartCuttingOrder | null> {

        return this.prisma.partCuttingOrder.findUnique({

            where: {
                number
            }

        });

    }

    async create(
        data: CreatePartCuttingOrderDto,
        rawMaterialId: bigint,
        expectedPieces: number
    ): Promise<PartCuttingOrderWithRelations> {

        return this.prisma.partCuttingOrder.create({

            data: {
                number: data.number,
                partId: BigInt(data.partId),
                rawMaterialId,
                rawMaterialQtyUsed: data.rawMaterialQtyUsed,
                expectedPieces,
                userId: BigInt(data.userId),
                observations: data.observations
            },

            include: this.include

        });

    }

    async update(
        id: bigint,
        data: UpdatePartCuttingOrderDto,
        rawMaterialId: bigint,
        expectedPieces: number
    ): Promise<PartCuttingOrderWithRelations> {

        return this.prisma.partCuttingOrder.update({

            where: {
                id
            },

            data: {
                number: data.number,
                partId: BigInt(data.partId),
                rawMaterialId,
                rawMaterialQtyUsed: data.rawMaterialQtyUsed,
                expectedPieces,
                observations: data.observations
            },

            include: this.include

        });

    }

    async updateStatus(
        id: bigint,
        status: "DRAFT" | "CONFIRMED" | "CANCELLED"
    ): Promise<PartCuttingOrder> {

        return this.prisma.partCuttingOrder.update({

            where: {
                id
            },

            data: {
                status
            }

        });

    }

    async confirm(
        id: bigint,
        goodPieces: number,
        defectivePieces: number
    ): Promise<PartCuttingOrderWithRelations> {

        return this.prisma.partCuttingOrder.update({

            where: {
                id
            },

            data: {
                goodPieces,
                defectivePieces,
                status: "CONFIRMED"
            },

            include: this.include

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): PartCuttingOrderRepository {

        return new PartCuttingOrderRepository(tx);

    }

}
