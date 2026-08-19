import { PartCategory } from "@prisma/client";

import { ConflictError, NotFoundError } from "../../shared/errors/index.js";

import { PartCategoryRepository } from "./part-category.repository.js";

export class PartCategoryService {

    private readonly repository = new PartCategoryRepository();

    async findAll(): Promise<PartCategory[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<PartCategory | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async create(data: {

        name: string;

        description?: string;

    }): Promise<PartCategory> {

        const existingCategory =
            await this.repository.findByName(
                data.name
            );

        if (existingCategory) {

            throw new ConflictError(
                "Ya existe una categoría de piezas con ese nombre."
            );

        }

        return this.repository.create(data);

    }

    async delete(
        id: string
    ): Promise<PartCategory> {

        const category =
            await this.repository.findById(
                BigInt(id)
            );

        if (!category) {

            throw new NotFoundError(
                "Categoría de piezas no encontrada."
            );

        }

        return this.repository.delete(
            BigInt(id)
        );

    }

}
