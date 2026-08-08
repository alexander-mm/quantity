import { Category } from "@prisma/client";

import { CategoryRepository } from "./category.repository.js";

import { ConflictError, NotFoundError } from "../../shared/errors/index.js";

export class CategoryService {

    private readonly repository = new CategoryRepository();

    async findAll(): Promise<Category[]> {

        return this.repository.findAll();

    }

    async findById(id: string): Promise<Category | null> {

        return this.repository.findById(BigInt(id));

    }

    async create(data: {

        name: string;

        description?: string;

        parentCategoryId?: bigint | null;

        stockMultiplier?: number;

    }): Promise<Category> {

        const existingCategory =
            await this.repository.findByName(data.name);

        if (existingCategory) {

            throw new ConflictError(
                "Ya existe una categoría con ese nombre."
            );

        }

        return this.repository.create(data);

    }

    async update(id: string, data: {

        name?: string;

        description?: string;

        parentCategoryId?: bigint | null;

        stockMultiplier?: number;

    }): Promise<Category> {

        const category =
            await this.repository.findById(BigInt(id));

        if (!category) {

            throw new NotFoundError(
                "Categoría no encontrada."
            );

        }

        if (data.name) {

            const existingCategory =
                await this.repository.findByName(data.name);

            if (existingCategory && existingCategory.id !== category.id) {

                throw new ConflictError(
                    "Ya existe una categoría con ese nombre."
                );

            }

        }

        return this.repository.update(BigInt(id), data);

    }

    async delete(
        id: string
    ): Promise<Category> {

        const category =
            await this.repository.findById(BigInt(id));

        if (!category) {

            throw new NotFoundError(
                "Categoría no encontrada."
            );

        }

        return this.repository.delete(BigInt(id));

    }

}