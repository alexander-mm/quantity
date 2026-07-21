import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class ProductQueryRepository extends BaseRepository {

    async findAll() {

        const products = await this.prisma.product.findMany({
            where: {
                isActive: true
            },
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
}