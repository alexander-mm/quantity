import { Product, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

type AdditionalCostInput = {
    description: string;
    amount: number;
};

export type ProductWithAdditionalCosts = Prisma.ProductGetPayload<{
    include: { additionalCosts: true };
}>;

export class ProductRepository extends BaseRepository {

    constructor(prismaClient?: PrismaClient | Prisma.TransactionClient) {
        super(prismaClient);
    }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                id: "desc"
            }
        });
    }

    async findById(
        id: bigint
    ): Promise<ProductWithAdditionalCosts | null> {
        return this.prisma.product.findUnique({
            where: {
                id
            },
            include: {
                additionalCosts: true
            }
        });
    }

    async findByUuid(
        uuid: string
    ): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: {
                uuid
            }
        });
    }
    async findByInternalCode(
        internalCode: string
    ): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: {
                internalCode
            }
        });
    }

    async findByBarcode(
        barcode: string
    ): Promise<Product | null> {
        return this.prisma.product.findFirst({
            where: {
                barcode
            }
        });
    }

    async create(data: {
        internalCode: string;
        barcode?: string | null;
        name: string;
        description?: string;
        brandId: bigint;
        categoryId: bigint;
        unitOfMeasureId: bigint;
        costPrice: number;
        baseCostPrice: number;
        pvp: number;
        pvpCop?: number;
        minimumStock: number;
        assembleOnSale?: boolean;
        additionalCosts?: AdditionalCostInput[];
    }): Promise<Product> {

        const { additionalCosts, ...rest } = data;

        return this.prisma.product.create({
            data: {
                ...rest,
                additionalCosts: additionalCosts && additionalCosts.length > 0
                    ? { create: additionalCosts }
                    : undefined
            }
        });
    }

    async createWithIds(data: {
        internalCode: string;
        barcode?: string | null;
        name: string;
        description?: string;
        brandId: bigint;
        categoryId: bigint;
        unitOfMeasureId: bigint;
        costPrice: number;
        minimumStock: number;
    }): Promise<Product> {

        return this.prisma.product.create({
            data
        });

    }

    async update(
        id: bigint,
        data: {
            internalCode: string;
            barcode?: string | null;
            name: string;
            description?: string;
            brandId: bigint;
            categoryId: bigint;
            unitOfMeasureId: bigint;
            costPrice: number;
            baseCostPrice: number;
            pvp: number;
            pvpCop?: number;
            minimumStock: number;
            assembleOnSale?: boolean;
            additionalCosts?: AdditionalCostInput[];
        }
    ): Promise<Product> {

        const { additionalCosts, ...rest } = data;

        return this.prisma.product.update({
            where: {
                id
            },
            data: {
                ...rest,
                additionalCosts: {
                    deleteMany: {},
                    create: additionalCosts ?? []
                }
            }
        });
    }

    async delete(
        id: bigint
    ): Promise<Product> {
        return this.prisma.product.delete({
            where: {
                id
            }
        });
    }

    async updateMinimumStock(
        id: bigint,
        minimumStock: number
    ): Promise<Product> {
        return this.prisma.product.update({
            where: {
                id
            },
            data: {
                minimumStock
            }
        });
    }

    async updatePricing(
        id: bigint,
        data: {
            costPrice?: number;
            baseCostPrice?: number;
            pvp?: number;
            pvpCop?: number;
        }
    ): Promise<Product> {

        return this.prisma.product.update({
            where: {
                id
            },
            data
        });
    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): ProductRepository {

        return new ProductRepository(tx);

    }
}