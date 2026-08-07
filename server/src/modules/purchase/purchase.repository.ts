import { Prisma, PrismaClient, Purchase } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { CreatePurchaseDto, UpdatePurchaseDto } from "./purchase.dto.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";

type PurchaseWithRelations =
    Prisma.PurchaseGetPayload<{
        include: {
            supplier: true;
            store: true;
            user: { select: typeof safeUserSelect };
            details: {
                include: {
                    product: true;
                    priceEntries: true;
                };
            };
        };
    }>;

export class PurchaseRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    private readonly include = {
        supplier: true,
        store: true,
        user: { select: safeUserSelect },
        details: {
            include: {
                product: true,
                priceEntries: true
            }
        }
    } as const;

    async findAll(): Promise<PurchaseWithRelations[]> {
        return this.prisma.purchase.findMany({
            orderBy: {
                purchaseDate: "desc"
            },
            include: this.include
        });
    }

    async findById(
        id: bigint
    ): Promise<PurchaseWithRelations | null> {
        return this.prisma.purchase.findUnique({
            where: { id },
            include: this.include
        });
    }

    async findByNumber(
        number: string
    ): Promise<Purchase | null> {
        return this.prisma.purchase.findFirst({
            where: {
                number
            }
        });
    }

    async create(
        data: CreatePurchaseDto
    ): Promise<Purchase> {

        const subtotal = data.details.reduce(
            (sum, item) => sum + (item.quantity * item.unitCost),
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

        return this.prisma.purchase.create({
            data: {
                number: data.number,
                supplierId: BigInt(data.supplierId),
                storeId: BigInt(data.storeId),
                userId: BigInt(data.userId),
                purchaseDate: data.purchaseDate,
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
                        unitCost: item.unitCost,
                        pvp: item.pvp,
                        pvpCop: item.pvpCop,
                        discount: item.discount ?? 0,
                        tax: item.tax ?? 0,
                        lineTotal:
                            (item.quantity * item.unitCost)
                            - (item.discount ?? 0)
                            + (item.tax ?? 0),
                        priceEntries: item.priceEntries && item.priceEntries.length > 0
                            ? {
                                create: item.priceEntries.map(entry => ({
                                    currency: entry.currency,
                                    sequence: entry.sequence,
                                    price: entry.price
                                }))
                            }
                            : undefined
                    }))
                }
            },
            include: this.include
        });

    }

    async update(
        _id: bigint,
        _data: UpdatePurchaseDto
    ): Promise<Purchase> {
        throw new Error(
            "Pendiente de implementar."
        );
    }

    async delete(
        id: bigint
    ): Promise<Purchase> {
        return this.prisma.purchase.update({
            where: { id },
            data: {
                status: "CANCELLED"
            }
        });
    }

    async confirm(
        id: bigint
    ): Promise<Purchase> {

        return this.prisma.purchase.update({
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
    ): PurchaseRepository {
        return new PurchaseRepository(tx);
    }

}
