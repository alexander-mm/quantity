import { UnitOfMeasure } from "@prisma/client";

import { ConflictError } from "../../shared/errors/index.js";

import { UnitOfMeasureRepository } from "./unit-of-measure.repository.js";

export class UnitOfMeasureService {

    private readonly repository = new UnitOfMeasureRepository();

    async findAll(): Promise<UnitOfMeasure[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<UnitOfMeasure | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async create(data: {

        code: string;

        name: string;

        description?: string;

    }): Promise<UnitOfMeasure> {

        const existingCode =
            await this.repository.findByCode(
                data.code
            );

        if (existingCode) {

            throw new ConflictError(
                "Ya existe una unidad de medida con ese código."
            );

        }

        const existingName =
            await this.repository.findByName(
                data.name
            );

        if (existingName) {

            throw new ConflictError(
                "Ya existe una unidad de medida con ese nombre."
            );

        }

        return this.repository.create(data);

    }

}