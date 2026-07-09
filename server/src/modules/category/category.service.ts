import { Category } from "@prisma/client";

import { CategoryRepository } from "./category.repository.js";

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

    }): Promise<Category> {

        const existingCategory = await this.repository.findByName(data.name);

        if (existingCategory) {

            throw new Error("CATEGORY_ALREADY_EXISTS");

        }

        return this.repository.create(data);

    }

}