import { prisma } from "../../database/index.js";
import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { ProductRepository } from "../product/product.repository.js";

import { ProductComponentRepository } from "./product-component.repository.js";
import { SetProductComponentsDto } from "./product-component.dto.js";

export class ProductComponentService {

    private readonly repository = new ProductComponentRepository();
    private readonly productRepository = new ProductRepository();

    async findByProduct(productId: string) {
        return this.repository.findByProduct(BigInt(productId));
    }

    async findProductIdsWithRecipe(): Promise<string[]> {
        const rows = await this.repository.findProductsWithRecipe();
        return rows.map(row => row.productId.toString());
    }

    async set(productId: string, data: SetProductComponentsDto) {

        const product = await this.productRepository.findById(BigInt(productId));

        if (!product) {
            throw new NotFoundError("Producto no encontrado.");
        }

        const seen = new Set<string>();

        for (const item of data.components) {

            if (item.componentProductId === productId) {
                throw new ValidationError("Un producto no puede ser componente de sí mismo.");
            }

            if (seen.has(item.componentProductId)) {
                throw new ValidationError("No puede repetir el mismo componente en la receta.");
            }

            seen.add(item.componentProductId);

            const componentProduct = await this.productRepository.findById(
                BigInt(item.componentProductId)
            );

            if (!componentProduct) {
                throw new NotFoundError("Uno de los productos componentes no existe.");
            }

        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);

            await repository.deleteByProduct(BigInt(productId));

            return repository.createMany(BigInt(productId), data);

        });

    }

}
