import { Brand } from "@prisma/client";

import { ConflictError, NotFoundError } from "../../shared/errors/index.js";

import { BrandRepository } from "./brand.repository.js";

export class BrandService {

    private readonly repository = new BrandRepository();

    async findAll(): Promise<Brand[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<Brand | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async create(data: {

        name: string;

        description?: string;

    }): Promise<Brand> {

        const existingBrand =
            await this.repository.findByName(
                data.name
            );

        if (existingBrand) {

            throw new ConflictError(
                "Ya existe una marca con ese nombre."
            );

        }

        return this.repository.create(data);

    }

    async delete(
        id: string
    ): Promise<Brand> {

        const brand =
            await this.repository.findById(
                BigInt(id)
            );

        if (!brand) {

            throw new NotFoundError(
                "Marca no encontrada."
            );

        }

        return this.repository.delete(
            BigInt(id)
        );

    }

}