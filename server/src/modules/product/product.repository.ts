import { Product, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class ProductRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<Product[]> {

        return this.prisma.product.findMany({

            where: {
                isActive: true
            },
            orderBy: {
                name: "asc"
            }
        });
    }


    
    async findById(
        id: bigint
    ): Promise<Product | null> {

        return this.prisma.product.findUnique({

            where: {
                id
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

        marginProfileId: bigint;

        costPrice: number;

        salePrice: number;

        minimumStock: number;

    }): Promise<Product> {

        return this.prisma.product.create({

            data

        });

    }

}