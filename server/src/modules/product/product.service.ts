import { Product, Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
import { ProductRepository } from "./product.repository.js";
import { BrandRepository } from "../brand/brand.repository.js";
import { CategoryRepository } from "../category/category.repository.js";
import { UnitOfMeasureRepository } from "../unit-of-measure/unit-of-measure.repository.js"
import { MarginProfileRepository } from "../margin-profile/margin-profile.repository.js";
import { ProductPriceRepository } from "../product-prices/product-price.repository.js";
import { ProductPriceEntryRepository } from "../product-price-entries/product-price-entry.repository.js";
import { PriceCalculator } from "../../shared/pricing/index.js";
import { prisma } from "../../database/prisma/prisma.js";

export class ProductService {

    private readonly repository = new ProductRepository();
    private readonly brandRepository = new BrandRepository();
    private readonly categoryRepository = new CategoryRepository();
    private readonly unitRepository = new UnitOfMeasureRepository();
    private readonly marginRepository = new MarginProfileRepository();
    private readonly productPriceRepository = new ProductPriceRepository();
    private readonly productPriceEntryRepository = new ProductPriceEntryRepository();

    async findAll(): Promise<Product[]> {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ): Promise<Product | null> {
        return this.repository.findById(
            BigInt(id)
        );
    }

    async findByInternalCode(
        internalCode: string
    ): Promise<Product | null> {
        return this.repository.findByInternalCode(
            internalCode
        );
    }

    async updateMinimumStock(
        id: string,
        minimumStock: number
    ): Promise<Product> {

        const product = await this.repository.findById(BigInt(id));

        if (!product) {
            throw new NotFoundError(
                "Producto no encontrado."
            );
        }

        return this.repository.updateMinimumStock(
            BigInt(id),
            minimumStock
        );

    }

    async delete(
        id: string
    ): Promise<Product> {

        return prisma.$transaction(async (tx) => {

            const repository =
                this.repository.withTransaction(tx);

            const productPriceRepository =
                this.productPriceRepository.withTransaction(tx);

            const productPriceEntryRepository =
                this.productPriceEntryRepository.withTransaction(tx);

            const product =
                await repository.findById(
                    BigInt(id)
                );

            if (!product) {
                throw new NotFoundError(
                    "Producto no encontrado."
                );
            }
            await productPriceRepository.deleteByProductId(
                product.id
            );
            await productPriceEntryRepository.deleteByProductId(
                product.id
            );
            return repository.delete(
                product.id
            );
        });
    }

    private async recalculatePrices(
        productId: bigint,
        pvp: number | undefined,
        pvpCop: number | undefined,
        marginRepository: MarginProfileRepository,
        productPriceRepository: ProductPriceRepository
    ): Promise<void> {

        await productPriceRepository.deleteByProductId(productId);

        if (pvp === undefined) {
            return;
        }

        const marginProfiles = await marginRepository.findAll();

        const prices = marginProfiles.map(profile => {

            const percentage = Number(profile.percentage);

            return {
                productId,
                marginProfileId: profile.id,
                price: new Prisma.Decimal(
                    PriceCalculator.calculateSalePriceFromDiscount(pvp, percentage)
                ),
                priceCop: pvpCop
                    ? new Prisma.Decimal(
                        PriceCalculator.calculateSalePriceFromDiscount(pvpCop, percentage)
                    )
                    : undefined
            };

        });

        await productPriceRepository.createMany(prices);

    }

    async syncPricingFromPurchase(
        id: bigint,
        data: {
            costPrice: number;
            pvp?: number;
            pvpCop?: number;
        },
        tx: Prisma.TransactionClient
    ): Promise<void> {

        const repository = this.repository.withTransaction(tx);
        const marginRepository = this.marginRepository.withTransaction(tx);
        const productPriceRepository = this.productPriceRepository.withTransaction(tx);

        await repository.updatePricing(id, data);

        await this.recalculatePrices(
            id,
            data.pvp,
            data.pvpCop,
            marginRepository,
            productPriceRepository
        );

    }

    async update(
        id: string,
        data: {
            internalCode: string;
            barcode?: string | null;
            name: string;
            description?: string;
            brand: string;
            categoryId: bigint;
            unitOfMeasure: string;
            costPrice: number;
            pvp: number;
            pvpCop?: number;
            minimumStock: number;
            assembleOnSale?: boolean;
        }
    ): Promise<Product> {

        return prisma.$transaction(async (tx) => {

            const repository =
                this.repository.withTransaction(tx);

            const brandRepository =
                this.brandRepository.withTransaction(tx);

            const categoryRepository =
                this.categoryRepository.withTransaction(tx);

            const unitRepository =
                this.unitRepository.withTransaction(tx);

            const marginRepository =
                this.marginRepository.withTransaction(tx);

            const productPriceRepository =
                this.productPriceRepository.withTransaction(tx);


            const product = await repository.findById(
                BigInt(id)
            );
            if (!product) {
                throw new NotFoundError(
                    "Producto no encontrado."
                );
            }

            const existingCode =
                await repository.findByInternalCode(
                    data.internalCode
                );
            if (
                existingCode &&
                existingCode.id !== product.id
            ) {
                throw new ConflictError(
                    "Ya existe un producto con ese código interno."
                );
            }

            if (data.barcode) {
                const existingBarcode =
                    await repository.findByBarcode(
                        data.barcode
                    );
                if (
                    existingBarcode &&
                    existingBarcode.id !== product.id
                ) {
                    throw new ConflictError(
                        "Ya existe un producto con ese código de barras."
                    );
                }
            }

            let brand =
                await brandRepository.findByName(
                    data.brand
                );
            if (!brand) {
                brand = await brandRepository.create({
                    name: data.brand
                });
            }

            const category =
                await categoryRepository.findById(
                    data.categoryId
                );
            if (!category) {
                throw new NotFoundError(
                    "La categoría no existe."
                );
            }

            let unit =
                await unitRepository.findByName(
                    data.unitOfMeasure
                );
            if (!unit) {
                unit = await unitRepository.create({
                    code: data.unitOfMeasure.toUpperCase(),
                    name: data.unitOfMeasure
                });
            }

            const updatedProduct =
                await repository.update(
                    BigInt(id),
                    {
                        internalCode: data.internalCode,
                        barcode: data.barcode,
                        name: data.name,
                        description: data.description,
                        brandId: brand.id,
                        categoryId: data.categoryId,
                        unitOfMeasureId: unit.id,
                        costPrice: data.costPrice,
                        pvp: data.pvp,
                        pvpCop: data.pvpCop,
                        minimumStock: data.minimumStock,
                        assembleOnSale: data.assembleOnSale
                    }
                );

            await this.recalculatePrices(
                updatedProduct.id,
                data.pvp,
                data.pvpCop,
                marginRepository,
                productPriceRepository
            );

            return updatedProduct;

        });
    }


    async create(data: {
        internalCode: string;
        barcode?: string | null;
        name: string;
        description?: string;
        brand: string;
        categoryId: bigint;
        unitOfMeasure: string;
        costPrice: number;
        pvp: number;
        pvpCop?: number;
        minimumStock: number;
        assembleOnSale?: boolean;
    }): Promise<Product> {

        const productRepository = this.repository;
        const brandRepository = this.brandRepository;
        const categoryRepository = this.categoryRepository;
        const unitRepository = this.unitRepository;

        const existingCode =
            await productRepository.findByInternalCode(
                data.internalCode
            );
        if (existingCode) {
            throw new ConflictError(
                "Ya existe un producto con ese código interno."
            );
        }

        if (data.barcode) {
            const existingBarcode =
                await this.repository.findByBarcode(
                    data.barcode
                );
            if (existingBarcode) {
                throw new ConflictError(
                    "Ya existe un producto con ese código de barras."
                );
            }
        }

        let brand =
            await brandRepository.findByName(
                data.brand
            );

        if (!brand) {

            brand = await this.brandRepository.create({

                name: data.brand

            });

        }

        const category =
            await categoryRepository.findById(
                data.categoryId
            );
        if (!category) {

            throw new NotFoundError(
                "La categoría no existe."
            );
        }

        let unit =
            await unitRepository.findByName(
                data.unitOfMeasure
            );


        if (!unit) {
            unit = await this.unitRepository.create({
                code: data.unitOfMeasure.toUpperCase(),
                name: data.unitOfMeasure
            });
        }


        const product = await this.repository.create({

            internalCode: data.internalCode,
            barcode: data.barcode,
            name: data.name,
            description: data.description,
            brandId: brand.id,
            categoryId: data.categoryId,
            unitOfMeasureId: unit.id,
            costPrice: data.costPrice,
            pvp: data.pvp,
            pvpCop: data.pvpCop,
            minimumStock: data.minimumStock,
            assembleOnSale: data.assembleOnSale
        });

        await this.recalculatePrices(
            product.id,
            data.pvp,
            data.pvpCop,
            this.marginRepository,
            this.productPriceRepository
        );

        return product;
    }
}
