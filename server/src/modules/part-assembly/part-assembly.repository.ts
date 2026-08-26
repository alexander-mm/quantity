import { PrismaClient, Prisma, PartAssembly } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
import { CreatePartAssemblyDto, UpdatePartAssemblyDto } from "./part-assembly.dto.js";

type PartAssemblyWithRelations =
    Prisma.PartAssemblyGetPayload<{
        include: {
            part: true;
            user: { select: typeof safeUserSelect };
            details: {
                include: {
                    componentPart: true;
                };
            };
            productDetails: {
                include: {
                    componentProduct: true;
                };
            };
        };
    }>;

export class PartAssemblyRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    private readonly include = {
        part: true,
        user: { select: safeUserSelect },
        details: {
            include: {
                componentPart: true
            }
        },
        productDetails: {
            include: {
                componentProduct: true
            }
        }
    } as const;

    async findAll(): Promise<PartAssemblyWithRelations[]> {

        return this.prisma.partAssembly.findMany({

            orderBy: {
                id: "desc"
            },

            include: this.include

        });

    }

    async findById(
        id: bigint
    ): Promise<PartAssemblyWithRelations | null> {

        return this.prisma.partAssembly.findUnique({

            where: {
                id
            },

            include: this.include

        });

    }

    async findByNumber(
        number: string
    ): Promise<PartAssembly | null> {

        return this.prisma.partAssembly.findUnique({

            where: {
                number
            }

        });

    }

    async create(
        data: CreatePartAssemblyDto,
        components: { componentPartId: bigint; quantity: number }[],
        products: { componentProductId: bigint; quantity: number }[]
    ): Promise<PartAssemblyWithRelations> {

        return this.prisma.partAssembly.create({

            data: {
                number: data.number,
                partId: BigInt(data.partId),
                quantity: data.quantity,
                userId: BigInt(data.userId),
                observations: data.observations,
                details: {
                    create: components.map(item => ({
                        componentPartId: item.componentPartId,
                        quantity: item.quantity
                    }))
                },
                productDetails: {
                    create: products.map(item => ({
                        componentProductId: item.componentProductId,
                        quantity: item.quantity
                    }))
                }
            },

            include: this.include

        });

    }

    async update(
        id: bigint,
        data: UpdatePartAssemblyDto,
        components: { componentPartId: bigint; quantity: number }[],
        products: { componentProductId: bigint; quantity: number }[]
    ): Promise<PartAssemblyWithRelations> {

        await this.prisma.partAssemblyDetail.deleteMany({
            where: {
                assemblyId: id
            }
        });

        await this.prisma.partAssemblyProductDetail.deleteMany({
            where: {
                assemblyId: id
            }
        });

        return this.prisma.partAssembly.update({

            where: {
                id
            },

            data: {
                number: data.number,
                partId: BigInt(data.partId),
                quantity: data.quantity,
                observations: data.observations,
                details: {
                    create: components.map(item => ({
                        componentPartId: item.componentPartId,
                        quantity: item.quantity
                    }))
                },
                productDetails: {
                    create: products.map(item => ({
                        componentProductId: item.componentProductId,
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
    ): Promise<PartAssembly> {

        return this.prisma.partAssembly.update({

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
    ): PartAssemblyRepository {

        return new PartAssemblyRepository(tx);

    }

}