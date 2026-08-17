import { Prisma, PrismaClient, StockTransfer } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
import { CreateStockTransferDto, UpdateStockTransferDto } from "./stock-transfer.dto.js";

const includeRelations = {
    originStore: true,
    destStore: true,
    destUser: { select: safeUserSelect },
    user: { select: safeUserSelect },
    details: {
        include: {
            product: true
        }
    }
} as const;

type StockTransferWithRelations =
    Prisma.StockTransferGetPayload<{ include: typeof includeRelations }>;

export class StockTransferRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<StockTransferWithRelations[]> {
        return this.prisma.stockTransfer.findMany({
            orderBy: { dispatchDate: "desc" },
            include: includeRelations
        });
    }

    async findAllForUser(params: { storeId: bigint; userId: bigint }): Promise<StockTransferWithRelations[]> {
        return this.prisma.stockTransfer.findMany({
            where: {
                OR: [
                    { originStoreId: params.storeId },
                    { destStoreId: params.storeId },
                    { destUserId: params.userId }
                ]
            },
            orderBy: { dispatchDate: "desc" },
            include: includeRelations
        });
    }

    async findById(id: bigint): Promise<StockTransferWithRelations | null> {
        return this.prisma.stockTransfer.findUnique({
            where: { id },
            include: includeRelations
        });
    }

    async findByNumber(number: string): Promise<StockTransfer | null> {
        return this.prisma.stockTransfer.findFirst({ where: { number } });
    }

    async create(data: CreateStockTransferDto): Promise<StockTransferWithRelations> {
        return this.prisma.stockTransfer.create({
            data: {
                number: data.number,
                originStoreId: BigInt(data.originStoreId),
                destType: data.destType,
                destStoreId: data.destStoreId ? BigInt(data.destStoreId) : undefined,
                destUserId: data.destUserId ? BigInt(data.destUserId) : undefined,
                userId: BigInt(data.userId),
                dispatchDate: data.dispatchDate,
                observations: data.observations,
                details: {
                    create: data.details.map(item => ({
                        productId: BigInt(item.productId),
                        quantitySent: item.quantitySent
                    }))
                }
            },
            include: includeRelations
        });
    }

    async update(id: bigint, data: UpdateStockTransferDto): Promise<StockTransferWithRelations> {
        return this.prisma.stockTransfer.update({
            where: { id },
            data: {
                number: data.number,
                originStoreId: BigInt(data.originStoreId),
                destType: data.destType,
                destStoreId: data.destStoreId ? BigInt(data.destStoreId) : null,
                destUserId: data.destUserId ? BigInt(data.destUserId) : null,
                dispatchDate: data.dispatchDate,
                observations: data.observations,
                details: {
                    deleteMany: {},
                    create: data.details.map(item => ({
                        productId: BigInt(item.productId),
                        quantitySent: item.quantitySent
                    }))
                }
            },
            include: includeRelations
        });
    }

    async markDispatched(id: bigint): Promise<StockTransferWithRelations> {
        return this.prisma.stockTransfer.update({
            where: { id },
            data: { status: "PENDING" },
            include: includeRelations
        });
    }

    async updateStatus(
        id: bigint,
        data: {
            status: "RECEIVED" | "WITH_ISSUES";
            receivedAt?: Date;
            receivedBy?: bigint;
            observations?: string;
        }
    ): Promise<StockTransferWithRelations> {
        return this.prisma.stockTransfer.update({
            where: { id },
            data,
            include: includeRelations
        });
    }

    async updateDetailReceived(
        detailId: bigint,
        quantityReceived: number
    ): Promise<void> {
        await this.prisma.stockTransferDetail.update({
            where: { id: detailId },
            data: { quantityReceived }
        });
    }

    withTransaction(tx: Prisma.TransactionClient): StockTransferRepository {
        return new StockTransferRepository(tx);
    }

}
