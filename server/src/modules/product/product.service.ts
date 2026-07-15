import { Product } from "@prisma/client";

import {
    ConflictError,
    NotFoundError
} from "../../shared/errors/index.js";

import { ProductRepository } from "./product.repository.js";

import { BrandRepository } from "../brand/brand.repository.js";
import { CategoryRepository } from "../category/category.repository.js";
import { UnitOfMeasureRepository } from "../unit-of-measure/unit-of-measure.repository.js"
import { MarginProfileRepository } from "../margin-profile/margin-profile.repository.js";

export class ProductService {

    private readonly repository = new ProductRepository();

    private readonly brandRepository = new BrandRepository();

    private readonly categoryRepository = new CategoryRepository();

    private readonly unitRepository = new UnitOfMeasureRepository();

    private readonly marginRepository = new MarginProfileRepository();

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

        const existingCode =
            await this.repository.findByInternalCode(
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

        const brand =
            await this.brandRepository.findById(
                data.brandId
            );

        if (!brand) {

            throw new NotFoundError(
                "La marca no existe."
            );

        }

        const category =
            await this.categoryRepository.findById(
                data.categoryId
            );

        if (!category) {

            throw new NotFoundError(
                "La categoría no existe."
            );

        }

        const unit =
            await this.unitRepository.findById(
                data.unitOfMeasureId
            );

        if (!unit) {

            throw new NotFoundError(
                "La unidad de medida no existe."
            );

        }

        const marginProfile =
            await this.marginRepository.findById(
                data.marginProfileId
            );

        if (!marginProfile) {

            throw new NotFoundError(
                "El perfil de margen no existe."
            );

        }

        return this.repository.create(data);

    }

}