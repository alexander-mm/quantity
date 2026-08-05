import { Product, Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
import { ProductRepository } from "./product.repository.js";
import { BrandRepository } from "../brand/brand.repository.js";
import { CategoryRepository } from "../category/category.repository.js";
import { UnitOfMeasureRepository } from "../unit-of-measure/unit-of-measure.repository.js"
import { MarginProfileRepository } from "../margin-profile/margin-profile.repository.js";
import { ProductPriceRepository } from "../product-prices/product-price.repository.js";
import { PriceCalculator } from "../../shared/pricing/index.js";
import { prisma } from "../../database/prisma/prisma.js";

export class ProductService {

    private readonly repository = new ProductRepository();
    private readonly brandRepository = new BrandRepository();
    private readonly categoryRepository = new CategoryRepository();
    private readonly unitRepository = new UnitOfMeasureRepository();
    private readonly marginRepository = new MarginProfileRepository();
    private readonly productPriceRepository = new ProductPriceRepository();

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

    async delete(
        id: string
    ): Promise<Product> {

        return prisma.$transaction(async (tx) => {

            const repository =
                this.repository.withTransaction(tx);

            const productPriceRepository =
                this.productPriceRepository.withTransaction(tx);

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
            return repository.delete(
                product.id
            );
        });
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
                        minimumStock: data.minimumStock
                    }
                );
            await productPriceRepository.deleteByProductId(
                updatedProduct.id
            );


            const marginProfiles = await marginRepository.findAll();

            const prices = marginProfiles
                .map(profile => ({
                    productId: updatedProduct.id,
                    marginProfileId: profile!.id,
                    price: new Prisma.Decimal(
                        PriceCalculator.calculateSalePriceFromDiscount(
                            data.pvp,
                            Number(profile!.percentage)
                        )
                    ),
                    priceCop: data.pvpCop
                        ? new Prisma.Decimal(
                            PriceCalculator.calculateSalePriceFromDiscount(
                                data.pvpCop,
                                Number(profile!.percentage)
                            )
                        )
                        : undefined,
                    isActive: true
                }));

            await productPriceRepository.createMany(
                prices
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
    }): Promise<Product> {

        const productRepository = this.repository;
        const brandRepository = this.brandRepository;
        const categoryRepository = this.categoryRepository;
        const unitRepository = this.unitRepository;
        const marginRepository = this.marginRepository;
        const productPriceRepository = this.productPriceRepository;

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
            minimumStock: data.minimumStock
        });

        const marginProfiles = await marginRepository.findAll();

        const prices = marginProfiles
            .map(profile => ({
                productId: product.id,
                marginProfileId: profile!.id,
                price: new Prisma.Decimal(
                    PriceCalculator.calculateSalePriceFromDiscount(
                        data.pvp,
                        Number(profile!.percentage)
                    )
                ),
                priceCop: data.pvpCop
                    ? new Prisma.Decimal(
                        PriceCalculator.calculateSalePriceFromDiscount(
                            data.pvpCop,
                            Number(profile!.percentage)
                        )
                    )
                    : undefined,
                isActive: true
            }));

        await productPriceRepository.createMany(prices);

        return product;
    }
}
