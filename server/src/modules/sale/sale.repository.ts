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
        };
    }>;

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
            include: {
                client: true,
                store: true,
                user: { select: safeUserSelect },
                details: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }

    async findById(
        id: bigint
    ): Promise<SaleWithRelations | null> {
        return this.prisma.sale.findUnique({
            where: { id },
            include: {
                client: true,
                store: true,
                user: { select: safeUserSelect },
                details: {
                    include: {
                        product: true
                    }
                }
            }
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
            include: {
                client: true,
                store: true,
                user: { select: safeUserSelect },
                details: {
                    include: {
                        product: true
                    }
                }
            }
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

        const total = subtotal - discount + tax;

        return this.prisma.sale.create({
            data: {
                clientUuid: data.clientUuid,
                number: data.number,
                clientId: BigInt(data.clientId),
                storeId: BigInt(data.storeId),
                userId: BigInt(data.userId),
                currency: data.currency,
                saleDate: data.saleDate,
                reference: data.reference,
                observations: data.observations,
                subtotal,
                discount,
                tax,
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
                }
            },
            include: {
                client: true,
                store: true,
                user: { select: safeUserSelect },
                details: {
                    include: {
                        product: true
                    }
                }
            }
        });

    }

    async update(
        _id: bigint,
        _data: UpdateSaleDto
    ): Promise<Sale> {
        throw new Error(
            "Pendiente de implementar."
        );
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
