import { prisma } from "../../database/index.js";
import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";
import { ProductRepository } from "../product/product.repository.js";

import { PartComponentProductRepository } from "./part-component-product.repository.js";
import { SetPartComponentProductsDto } from "./part-component-product.dto.js";

export class PartComponentProductService {

    private readonly repository = new PartComponentProductRepository();
    private readonly partRepository = new PartRepository();
    private readonly productRepository = new ProductRepository();

    async findByPart(partId: string) {
        return this.repository.findByPart(BigInt(partId));
    }

    async set(partId: string, data: SetPartComponentProductsDto) {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        const seen = new Set<string>();

        for (const item of data.products) {

            if (seen.has(item.componentProductId)) {
                throw new ValidationError("No puede repetir el mismo producto en la receta.");
            }

            seen.add(item.componentProductId);

            const componentProduct = await this.productRepository.findById(
                BigInt(item.componentProductId)
            );

            if (!componentProduct) {
                throw new NotFoundError("Uno de los productos seleccionados no existe.");
            }

        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);

            await repository.deleteByPart(BigInt(partId));

            return repository.createMany(BigInt(partId), data);

        });

    }

}