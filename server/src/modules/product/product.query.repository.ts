import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class ProductQueryRepository extends BaseRepository {

    async findAll() {

        const products = await this.prisma.product.findMany({

            select: {
                id: true,
                internalCode: true,
                name: true,
                minimumStock: true,
                isActive: true,
                brand: {
                    select: {
                        name: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                },
                productPrices: {
                    where: {
                        isActive: true
                    },
                    orderBy: {
                        marginProfile: {
                            displayOrder: "asc"
                        }
                    },
                    take: 1,
                    select: {
                        price: true
                    }
                }
            },
            orderBy: {
                name: "asc"
            }
        });

        return products.map(product => ({
            ...product,
            price: product.productPrices[0]?.price ?? null
        }));
    }

    async findById(id: bigint) {

        const product = await this.prisma.product.findUnique({

            where: {
                id
            },

            select: {

                id: true,
                internalCode: true,
                barcode: true,
                name: true,
                description: true,
                costPrice: true,
                minimumStock: true,
                categoryId: true,

                brand: {
                    select: {
                        name: true
                    }
                },

                unitOfMeasure: {
                    select: {
                        name: true
                    }
                },

                productPrices: {
                    where: {
                        isActive: true
                    },
                    select: {
                        marginProfileId: true
                    }
                }
            }
        });
        if (!product) {
            return null;
        }

        return {

            id: product.id,
            internalCode: product.internalCode,
            barcode: product.barcode,
            name: product.name,
            description: product.description,
            brand: product.brand.name,
            categoryId: product.categoryId,
            unitOfMeasure: product.unitOfMeasure.name,
            marginProfileIds: product.productPrices.map(
                p => p.marginProfileId
            ),
            costPrice: product.costPrice,
            minimumStock: product.minimumStock
        };
    }
}