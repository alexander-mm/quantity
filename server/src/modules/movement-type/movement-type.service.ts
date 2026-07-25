import { MovementType, Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
import { MovementTypeRepository } from "./movement-type.repository.js";

export class MovementTypeService {

    private readonly repository = new MovementTypeRepository();
    async findAll(): Promise<MovementType[]> {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ): Promise<MovementType> {

        const movementType =
            await this.repository.findById(
                BigInt(id)
            );

        if (!movementType) {

            throw new NotFoundError(
                "Tipo de movimiento no encontrado."
            );

        }

        return movementType;

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

    async update(
        id: string,
        data: Prisma.MovementTypeUpdateInput
    ): Promise<MovementType> {

        const movementType =
            await this.findById(id);

        const codeExists =
            await this.repository.findByCode(
                String(data.code)
            );

        if (
            codeExists &&
            codeExists.id !== movementType.id
        ) {

            throw new ConflictError(
                "Ya existe un tipo de movimiento con ese código."
            );

        }

        const nameExists =
            await this.repository.findByName(
                String(data.name)
            );

        if (
            nameExists &&
            nameExists.id !== movementType.id
        ) {

            throw new ConflictError(
                "Ya existe un tipo de movimiento con ese nombre."
            );

        }

        return this.repository.update(
            movementType.id,
            data
        );

    }

    async delete(
        id: string
    ): Promise<MovementType> {

        const movementType =
            await this.findById(id);

        return this.repository.delete(
            movementType.id
        );

    }
}