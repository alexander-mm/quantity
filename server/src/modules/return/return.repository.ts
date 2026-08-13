import { Return, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";

const includeRelations = {
    sale: { select: { id: true, number: true } },
    saleDetail: { select: { id: true, unitPrice: true } },
    product: true,
    store: true,
    user: { select: safeUserSelect },
    resolver: { select: safeUserSelect }
} satisfies Prisma.ReturnInclude;

type ReturnWithRelations = Prisma.ReturnGetPayload<{ include: typeof includeRelations }>;

export class ReturnRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<ReturnWithRelations[]> {
        return this.prisma.return.findMany({
            include: includeRelations,
            orderBy: { returnDate: "desc" }
        });
    }

    async findById(id: bigint): Promise<ReturnWithRelations | null> {
        return this.prisma.return.findUnique({
            where: { id },
            include: includeRelations
        });
    }

    async findByNumber(number: string): Promise<Return | null> {
        return this.prisma.return.findUnique({
            where: { number }
        });
    }

    async create(data: Prisma.ReturnCreateInput): Promise<ReturnWithRelations> {
        return this.prisma.return.create({
            data,
            include: includeRelations
        });
    }

    async resolve(
        id: bigint,
        data: {
            disposition: "RESTOCK" | "DAMAGED";
            resolvedBy: bigint;
        }
    ): Promise<ReturnWithRelations> {
        return this.prisma.return.update({
            where: { id },
            data: {
                status: "RESOLVED",
                disposition: data.disposition,
                resolvedAt: new Date(),
                resolver: { connect: { id: data.resolvedBy } }
            },
            include: includeRelations
        });
    }

    withTransaction(tx: Prisma.TransactionClient): ReturnRepository {
        return new ReturnRepository(tx);
    }

}
