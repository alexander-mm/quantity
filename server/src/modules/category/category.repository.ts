import { Category } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class CategoryRepository extends BaseRepository {

    async findAll(): Promise<Category[]> {

        return this.prisma.category.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

    }

    async findById(id: bigint): Promise<Category | null> {

        return this.prisma.category.findUnique({

            where: {
                id
            }

        });

    }

    async findByUuid(uuid: string): Promise<Category | null> {

        return this.prisma.category.findUnique({

            where: {
                uuid
            }

        });

    }

    async findByName(name: string): Promise<Category | null> {

        return this.prisma.category.findUnique({

            where: {
                name
            }

        });

    }

    async create(data: {

        name: string;

        description?: string;

        parentCategoryId?: bigint | null;

    }): Promise<Category> {

        return this.prisma.category.create({

            data

        });

    }

}