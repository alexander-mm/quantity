import { Quote, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
import { CreateQuoteDto, UpdateQuoteDto } from "./quote.dto.js";

const includeRelations = {
    client: true,
    user: { select: safeUserSelect },
    convertedSale: { select: { id: true, number: true } },
    details: {
        include: {
            product: true
        }
    }
} satisfies Prisma.QuoteInclude;

type QuoteWithRelations = Prisma.QuoteGetPayload<{ include: typeof includeRelations }>;

function computeTotals(details: CreateQuoteDto["details"]) {

    const subtotal = details.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice),
        0
    );

    const discount = details.reduce(
        (sum, item) => sum + (item.discount ?? 0),
        0
    );

    const tax = details.reduce(
        (sum, item) => sum + (item.tax ?? 0),
        0
    );

    const total = subtotal - discount + tax;

    return { subtotal, discount, tax, total };

}

export class QuoteRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<QuoteWithRelations[]> {
        return this.prisma.quote.findMany({
            include: includeRelations,
            orderBy: { id: "desc" }
        });
    }

    async findById(id: bigint): Promise<QuoteWithRelations | null> {
        return this.prisma.quote.findUnique({
            where: { id },
            include: includeRelations
        });
    }

    async findByNumber(number: string): Promise<Quote | null> {
        return this.prisma.quote.findUnique({
            where: { number }
        });
    }

    async create(
        data: CreateQuoteDto
    ): Promise<QuoteWithRelations> {

        const totals = computeTotals(data.details);

        return this.prisma.quote.create({
            data: {
                number: data.number,
                client: { connect: { id: BigInt(data.clientId) } },
                user: { connect: { id: BigInt(data.userId) } },
                currency: data.currency,
                quoteDate: data.quoteDate,
                validUntil: data.validUntil,
                observations: data.observations,
                subtotal: totals.subtotal,
                discount: totals.discount,
                tax: totals.tax,
                total: totals.total,
                details: {
                    create: data.details.map(item => ({
                        product: { connect: { id: BigInt(item.productId) } },
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount ?? 0,
                        tax: item.tax ?? 0,
                        lineTotal:
                            (item.quantity * item.unitPrice)
                            - (item.discount ?? 0)
                            + (item.tax ?? 0)
                    }))
                }
            },
            include: includeRelations
        });

    }

    async update(
        id: bigint,
        data: UpdateQuoteDto
    ): Promise<QuoteWithRelations> {

        const totals = computeTotals(data.details);

        return this.prisma.quote.update({
            where: { id },
            data: {
                number: data.number,
                client: { connect: { id: BigInt(data.clientId) } },
                currency: data.currency,
                quoteDate: data.quoteDate,
                validUntil: data.validUntil,
                observations: data.observations,
                subtotal: totals.subtotal,
                discount: totals.discount,
                tax: totals.tax,
                total: totals.total,
                details: {
                    deleteMany: {},
                    create: data.details.map(item => ({
                        product: { connect: { id: BigInt(item.productId) } },
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount ?? 0,
                        tax: item.tax ?? 0,
                        lineTotal:
                            (item.quantity * item.unitPrice)
                            - (item.discount ?? 0)
                            + (item.tax ?? 0)
                    }))
                }
            },
            include: includeRelations
        });

    }

    async delete(id: bigint): Promise<void> {

        await this.prisma.quoteDetail.deleteMany({ where: { quoteId: id } });
        await this.prisma.quote.delete({ where: { id } });

    }

    async markConverted(
        id: bigint,
        saleId: bigint
    ): Promise<QuoteWithRelations> {

        return this.prisma.quote.update({
            where: { id },
            data: {
                convertedSale: { connect: { id: saleId } }
            },
            include: includeRelations
        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): QuoteRepository {
        return new QuoteRepository(tx);
    }

}
