import { DamagedPart, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export type DamagedPartWithRelations =
    Prisma.DamagedPartGetPayload<{
        include: { part: true };
    }>;

export class DamagedPartRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<DamagedPartWithRelations[]> {
        return this.prisma.damagedPart.findMany({
            include: { part: true },
            orderBy: { partId: "asc" }
        });
    }

    async findByPart(
        partId: bigint
    ): Promise<DamagedPart | null> {
        return this.prisma.damagedPart.findUnique({
            where: { partId }
        });
    }

    async create(
        partId: bigint,
        quantity: Prisma.Decimal
    ): Promise<DamagedPart> {
        return this.prisma.damagedPart.create({
            data: {
                part: { connect: { id: partId } },
                quantity
            }
        });
    }

    async updateQuantity(
        id: bigint,
        quantity: Prisma.Decimal
    ): Promise<DamagedPart> {
        return this.prisma.damagedPart.update({
            where: { id },
            data: { quantity }
        });
    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): DamagedPartRepository {
        return new DamagedPartRepository(tx);
    }
}
