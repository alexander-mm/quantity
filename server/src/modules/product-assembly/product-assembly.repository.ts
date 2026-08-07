import { PrismaClient, Prisma, ProductAssembly } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
import { CreateProductAssemblyDto, UpdateProductAssemblyDto } from "./product-assembly.dto.js";

type ProductAssemblyWithRelations =
    Prisma.ProductAssemblyGetPayload<{
        include: {
            product: true;
            user: { select: typeof safeUserSelect };
            details: {
                include: {
                    componentProduct: true;
                };
            };
            partDetails: {
                include: {
                    part: true;
                };
            };
        };
    }>;

export class ProductAssemblyRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    private readonly include = {
        product: true,
        user: { select: safeUserSelect },
        details: {
            include: {
                componentProduct: true
            }
        },
        partDetails: {
            include: {
                part: true
            }
        }
    } as const;

    async findAll(): Promise<ProductAssemblyWithRelations[]> {

        return this.prisma.productAssembly.findMany({

            orderBy: {
                assemblyDate: "desc"
            },

            include: this.include

        });

    }

    async findById(
        id: bigint
    ): Promise<ProductAssemblyWithRelations | null> {

        return this.prisma.productAssembly.findUnique({

            where: {
                id
            },

            include: this.include

        });

    }

    async findByNumber(
        number: string
    ): Promise<ProductAssembly | null> {

        return this.prisma.productAssembly.findUnique({

            where: {
                number
            }

        });

    }

    async create(
        data: CreateProductAssemblyDto,
        components: { componentProductId: bigint; quantity: number }[],
        parts: { partId: bigint; quantity: number }[]
    ): Promise<ProductAssemblyWithRelations> {

        return this.prisma.productAssembly.create({

            data: {
                number: data.number,
                productId: BigInt(data.productId),
                quantity: data.quantity,
                userId: BigInt(data.userId),
                observations: data.observations,
                details: {
                    create: components.map(item => ({
                        componentProductId: item.componentProductId,
                        quantity: item.quantity
                    }))
                },
                partDetails: {
                    create: parts.map(item => ({
                        partId: item.partId,
                        quantity: item.quantity
                    }))
                }
            },

            include: this.include

        });

    }

    async update(
        id: bigint,
        data: UpdateProductAssemblyDto,
        components: { componentProductId: bigint; quantity: number }[],
        parts: { partId: bigint; quantity: number }[]
    ): Promise<ProductAssemblyWithRelations> {

        await this.prisma.productAssemblyDetail.deleteMany({
            where: {
                assemblyId: id
            }
        });

        await this.prisma.productAssemblyPartDetail.deleteMany({
            where: {
                assemblyId: id
            }
        });

        return this.prisma.productAssembly.update({

            where: {
                id
            },

            data: {
                number: data.number,
                productId: BigInt(data.productId),
                quantity: data.quantity,
                observations: data.observations,
                details: {
                    create: components.map(item => ({
                        componentProductId: item.componentProductId,
                        quantity: item.quantity
                    }))
                },
                partDetails: {
                    create: parts.map(item => ({
                        partId: item.partId,
                        quantity: item.quantity
                    }))
                }
            },

            include: this.include

        });

    }

    async updateStatus(
        id: bigint,
        status: "DRAFT" | "CONFIRMED" | "CANCELLED"
    ): Promise<ProductAssembly> {

        return this.prisma.productAssembly.update({

            where: {
                id
            },

            data: {
                status
            }

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): ProductAssemblyRepository {

        return new ProductAssemblyRepository(tx);

    }

}
