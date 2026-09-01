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
            paymentMethods: true;
            accountReceivable: {
                include: {
                    downPaymentVouchers: true;
                    downPaymentMethods: true;
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
    paymentMethods: true,
    accountReceivable: {
        include: {
            downPaymentVouchers: true,
            downPaymentMethods: true
        }
    }
} as const;

export class SaleRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(
        storeId?: bigint
    ): Promise<SaleWithRelations[]> {
        return this.prisma.sale.findMany({
            where: storeId ? { storeId } : undefined,
            orderBy: {
                id: "desc"
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

    // Última venta registrada en la tienda, usada para calcular el siguiente
    // consecutivo (Sale.number es único por tienda, no globalmente).
    async findLastByStore(
        storeId: bigint
    ): Promise<Sale | null> {
        return this.prisma.sale.findFirst({
            where: {
                storeId
            },
            orderBy: {
                id: "desc"
            }
        });
    }

    async lockStoreForNumbering(
        storeId: bigint
    ): Promise<void> {
        await this.prisma.$queryRaw`SELECT id FROM "Store" WHERE id = ${storeId} FOR UPDATE`;
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
                // Asignado por SaleService.create antes de llamar aquí.
                number: data.number!,
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
                transferVouchers: data.transferVouchers && data.transferVouchers.length > 0
                    ? {
                        create: data.transferVouchers.map(number => ({ number }))
                    }
                    : undefined,
                paymentMethods: data.paymentMethod !== "CREDIT" && data.paymentMethods
                    ? {
                        create: data.paymentMethods.map(entry => ({
                            method: entry.method,
                            amount: entry.amount
                        }))
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
                // number no se toca aquí: es un consecutivo por tienda asignado
                // al crear la venta y es de solo lectura una vez asignado.
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
                    create: data.transferVouchers && data.transferVouchers.length > 0
                        ? data.transferVouchers.map(number => ({ number }))
                        : []
                },
                paymentMethods: {
                    deleteMany: {},
                    create: data.paymentMethod !== "CREDIT" && data.paymentMethods
                        ? data.paymentMethods.map(entry => ({
                            method: entry.method,
                            amount: entry.amount
                        }))
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
