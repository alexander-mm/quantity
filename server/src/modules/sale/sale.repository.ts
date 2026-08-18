import { Prisma, PrismaClient, Sale } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { CreateSaleDto, UpdateSaleDto } from "./sale.dto.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";

export type SaleWithRelations =
    Prisma.SaleGetPayload<{
        include: {
            client: true;
            store: true;
            user: { select: typeof safeUserSelect };
            details: {
                include: {
                    product: true;
                };
            };
            transferVouchers: true;
            accountReceivable: {
                include: {
                    downPaymentVouchers: true;
                };
            };
        };
    }>;

const saleIncludeRelations = {
    client: true,
    store: true,
    user: { select: safeUserSelect },
    details: {
        include: {
            product: true
        }
    },
    transferVouchers: true,
    accountReceivable: {
        include: {
            downPaymentVouchers: true
        }
    }
} as const;

export class SaleRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<SaleWithRelations[]> {
        return this.prisma.sale.findMany({
            orderBy: {
                saleDate: "desc"
            },
            include: saleIncludeRelations
        });
    }

    async findById(
        id: bigint
    ): Promise<SaleWithRelations | null> {
        return this.prisma.sale.findUnique({
            where: { id },
            include: saleIncludeRelations
        });
    }

    async findByNumber(
        number: string
    ): Promise<Sale | null> {
        return this.prisma.sale.findFirst({
            where: {
                number
            }
        });
    }

    async findByClientUuid(
        clientUuid: string
    ): Promise<SaleWithRelations | null> {
        return this.prisma.sale.findUnique({
            where: { clientUuid },
            include: saleIncludeRelations
        });
    }

    async create(
        data: CreateSaleDto
    ): Promise<SaleWithRelations> {

        const subtotal = data.details.reduce(
            (sum, item) => sum + (item.quantity * item.unitPrice),
            0
        );

        const discount = data.details.reduce(
            (sum, item) => sum + (item.discount ?? 0),
            0
        );

        const tax = data.details.reduce(
            (sum, item) => sum + (item.tax ?? 0),
            0
        );

        const shippingCost = data.hasShipping ? (data.shippingCost ?? 0) : 0;
        const laborCost = data.hasLabor ? (data.laborCost ?? 0) : 0;

        const total = subtotal - discount + tax + shippingCost + laborCost;

        return this.prisma.sale.create({
            data: {
                clientUuid: data.clientUuid,
                number: data.number,
                clientId: BigInt(data.clientId),
                storeId: BigInt(data.storeId),
                userId: BigInt(data.userId),
                currency: data.currency,
                paymentMethod: data.paymentMethod,
                saleDate: data.saleDate,
                reference: data.reference,
                observations: data.observations,
                subtotal,
                discount,
                tax,
                hasShipping: data.hasShipping ?? false,
                shippingCost,
                hasLabor: data.hasLabor ?? false,
                laborCost,
                total,
                details: {
                    create: data.details.map(item => ({
                        productId: BigInt(item.productId),
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount ?? 0,
                        tax: item.tax ?? 0,
                        lineTotal:
                            (item.quantity * item.unitPrice)
                            - (item.discount ?? 0)
                            + (item.tax ?? 0)
                    }))
                },
                transferVouchers: data.paymentMethod === "TRANSFER" && data.transferVouchers
                    ? {
                        create: data.transferVouchers.map(number => ({ number }))
                    }
                    : undefined
            },
            include: saleIncludeRelations
        });

    }

    async update(
        id: bigint,
        data: UpdateSaleDto
    ): Promise<SaleWithRelations> {

        const subtotal = data.details.reduce(
            (sum, item) => sum + (item.quantity * item.unitPrice),
            0
        );

        const discount = data.details.reduce(
            (sum, item) => sum + (item.discount ?? 0),
            0
        );

        const tax = data.details.reduce(
            (sum, item) => sum + (item.tax ?? 0),
            0
        );

        const shippingCost = data.hasShipping ? (data.shippingCost ?? 0) : 0;
        const laborCost = data.hasLabor ? (data.laborCost ?? 0) : 0;

        const total = subtotal - discount + tax + shippingCost + laborCost;

        return this.prisma.sale.update({
            where: { id },
            data: {
                number: data.number,
                clientId: BigInt(data.clientId),
                storeId: BigInt(data.storeId),
                currency: data.currency,
                paymentMethod: data.paymentMethod,
                saleDate: data.saleDate,
                reference: data.reference,
                observations: data.observations,
                subtotal,
                discount,
                tax,
                hasShipping: data.hasShipping ?? false,
                shippingCost,
                hasLabor: data.hasLabor ?? false,
                laborCost,
                total,
                details: {
                    deleteMany: {},
                    create: data.details.map(item => ({
                        productId: BigInt(item.productId),
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount ?? 0,
                        tax: item.tax ?? 0,
                        lineTotal:
                            (item.quantity * item.unitPrice)
                            - (item.discount ?? 0)
                            + (item.tax ?? 0)
                    }))
                },
                transferVouchers: {
                    deleteMany: {},
                    create: data.paymentMethod === "TRANSFER" && data.transferVouchers
                        ? data.transferVouchers.map(number => ({ number }))
                        : []
                }
            },
            include: saleIncludeRelations
        });

    }

    async delete(
        id: bigint
    ): Promise<Sale> {
        return this.prisma.sale.update({
            where: { id },
            data: {
                status: "CANCELLED"
            }
        });
    }

    async confirm(
        id: bigint
    ): Promise<Sale> {

        return this.prisma.sale.update({
            where: {
                id
            },
            data: {
                status: "CONFIRMED"
            }
        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): SaleRepository {
        return new SaleRepository(tx);
    }

}
