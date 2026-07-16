import { MovementType, Prisma } from "@prisma/client";

import { ConflictError } from "../../shared/errors/index.js";

import { MovementTypeRepository } from "./movement-type.repository.js";

export class MovementTypeService {

    private readonly repository = new MovementTypeRepository();

    async findAll(): Promise<MovementType[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<MovementType | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async create(
        data: Prisma.MovementTypeCreateInput
    ): Promise<MovementType> {

        const codeExists =
            await this.repository.findByCode(
                data.code
            );

        if (codeExists) {

            throw new ConflictError(
                "Ya existe un tipo de movimiento con ese código."
            );

        }

        const nameExists =
            await this.repository.findByName(
                data.name
            );

        if (nameExists) {

            throw new ConflictError(
                "Ya existe un tipo de movimiento con ese nombre."
            );

        }

        return this.repository.create(data);

    }

}