import { prisma } from "../../database/index.js";
import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";
import { PartComponentProductRepository } from "../part-component-product/part-component-product.repository.js";

import { PartComponentRepository } from "./part-component.repository.js";
import { SetPartComponentsDto } from "./part-component.dto.js";

export class PartComponentService {

    private readonly repository = new PartComponentRepository();
    private readonly partRepository = new PartRepository();
    private readonly componentProductRepository = new PartComponentProductRepository();

    async findByPart(partId: string) {
        return this.repository.findByPart(BigInt(partId));
    }

    async findPartIdsWithRecipe(): Promise<string[]> {

        const [componentRows, productRows] = await Promise.all([
            this.repository.findPartsWithRecipe(),
            this.componentProductRepository.findPartsWithProducts()
        ]);

        const ids = new Set<string>();

        componentRows.forEach(row => ids.add(row.partId.toString()));
        productRows.forEach(row => ids.add(row.partId.toString()));

        return Array.from(ids);

    }

    async set(partId: string, data: SetPartComponentsDto) {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        const seen = new Set<string>();

        for (const item of data.components) {

            if (item.componentPartId === partId) {
                throw new ValidationError("Una pieza no puede ser componente de sí misma.");
            }

            if (seen.has(item.componentPartId)) {
                throw new ValidationError("No puede repetir la misma pieza componente en la receta.");
            }

            seen.add(item.componentPartId);

            const componentPart = await this.partRepository.findById(
                BigInt(item.componentPartId)
            );

            if (!componentPart) {
                throw new NotFoundError("Una de las piezas componentes no existe.");
            }

        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);

            await repository.deleteByPart(BigInt(partId));

            return repository.createMany(BigInt(partId), data);

        });

    }

}