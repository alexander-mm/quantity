import { MarginProfile, Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
import { MarginProfileRepository } from "./margin-profile.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { ProductPriceRepository } from "../product-prices/product-price.repository.js";
import { PriceCalculator } from "../../shared/pricing/index.js";
import { prisma } from "../../database/index.js";

export class MarginProfileService {

    private readonly repository = new MarginProfileRepository();
    private readonly productRepository = new ProductRepository();
    private readonly productPriceRepository = new ProductPriceRepository();

    async findAll(): Promise<MarginProfile[]> {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ): Promise<MarginProfile | null> {
        return this.repository.findById(
            BigInt(id)
        );
    }

    private async recalculateProductsForProfile(
        profile: MarginProfile,
        productRepository: ProductRepository,
        productPriceRepository: ProductPriceRepository
    ): Promise<void> {

        const percentage = Number(profile.percentage);
        const products = await productRepository.findAll();

        for (const product of products) {

            if (product.pvp === null) {
                continue;
            }

            await productPriceRepository.upsertForProductAndProfile(
                product.id,
                profile.id,
                {
                    price: new Prisma.Decimal(
                        PriceCalculator.calculateSalePriceFromDiscount(
                            Number(product.pvp),
                            percentage
                        )
                    ),
                    priceCop: product.pvpCop
                        ? new Prisma.Decimal(
                            PriceCalculator.calculateSalePriceFromDiscount(
                                Number(product.pvpCop),
                                percentage
                            )
                        )
                        : undefined
                }
            );

        }

    }

    async create(data: {
        name: string;
        percentage: number;
        displayOrder: number;
    }): Promise<MarginProfile> {

        const existingMarginProfile =
            await this.repository.findByName(
                data.name
            );

        if (existingMarginProfile) {
            throw new ConflictError(
                "Ya existe una lista de precio con ese nombre."
            );
        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const productRepository = this.productRepository.withTransaction(tx);
            const productPriceRepository = this.productPriceRepository.withTransaction(tx);

            const profile = await repository.create(data);

            await this.recalculateProductsForProfile(
                profile,
                productRepository,
                productPriceRepository
            );

            return profile;

        });

    }

    async update(
        id: string,
        data: {
            name: string;
            percentage: number;
            displayOrder: number;
        }
    ): Promise<MarginProfile> {

        const marginProfile =
            await this.repository.findById(
                BigInt(id)
            );

        if (!marginProfile) {
            throw new NotFoundError(
                "Lista de precio no encontrada."
            );
        }

        const existingMarginProfile =
            await this.repository.findByName(
                data.name
            );

        if (
            existingMarginProfile &&
            existingMarginProfile.id !== marginProfile.id
        ) {
            throw new ConflictError(
                "Ya existe una lista de precio con ese nombre."
            );
        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const productRepository = this.productRepository.withTransaction(tx);
            const productPriceRepository = this.productPriceRepository.withTransaction(tx);

            const updated = await repository.update(
                BigInt(id),
                data
            );

            await this.recalculateProductsForProfile(
                updated,
                productRepository,
                productPriceRepository
            );

            return updated;

        });

    }

    async delete(
        id: string
    ): Promise<MarginProfile> {
        const marginProfile =
            await this.repository.findById(
                BigInt(id)
            );
        if (!marginProfile) {
            throw new NotFoundError(
                "Lista de precio no encontrada."
            );
        }
        return this.repository.delete(
            BigInt(id)
        );
    }
}
