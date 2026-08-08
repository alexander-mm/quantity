import { Part, Prisma } from "@prisma/client";

import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartMovementRepository } from "../part-movement/part-movement.repository.js";

import { PartRepository } from "./part.repository.js";
import { CreatePartDto, UpdatePartDto } from "./part.dto.js";

export class PartService {

    private readonly repository = new PartRepository();
    private readonly movementRepository = new PartMovementRepository();

    async findAll(): Promise<Part[]> {

        return this.repository.findAll();

    }

    async findLowStock(): Promise<Part[]> {

        return this.repository.findLowStock();

    }

    async findMediumStock(): Promise<Part[]> {

        return this.repository.findMediumStock();

    }

    async findById(
        id: string
    ): Promise<Part> {

        const part = await this.repository.findById(
            BigInt(id)
        );

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        return part;

    }

    async updateMinimumStock(
        id: string,
        minimumStock: number
    ): Promise<Part> {

        const part = await this.repository.findById(BigInt(id));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        return this.repository.update(BigInt(id), { minimumStock });

    }

    async create(
        data: CreatePartDto
    ): Promise<Part> {

        const existing = await this.repository.findByCode(data.code);

        if (existing) {
            throw new ConflictError("Ya existe una pieza con ese código.");
        }

        if (!data.initialQuantity || data.initialQuantity <= 0) {

            return this.repository.create({
                code: data.code,
                name: data.name,
                description: data.description,
                minimumStock: data.minimumStock ?? 0
            });

        }

        return prisma.$transaction(async (tx) => {

            const partRepository = this.repository.withTransaction(tx);
            const movementRepository = this.movementRepository.withTransaction(tx);

            const part = await partRepository.create({
                code: data.code,
                name: data.name,
                description: data.description,
                minimumStock: data.minimumStock ?? 0
            });

            await movementRepository.create({
                number: `CARGA-${part.code}-${Date.now()}`,
                type: "IN",
                userId: data.userId,
                movementDate: new Date(),
                observations: "Carga inicial al registrar la pieza.",
                details: [{
                    partId: part.id.toString(),
                    quantity: data.initialQuantity!
                }]
            });

            return partRepository.incrementQuantity(
                part.id,
                new Prisma.Decimal(data.initialQuantity!)
            );

        });

    }

    async update(
        id: string,
        data: UpdatePartDto
    ): Promise<Part> {

        const part = await this.repository.findById(BigInt(id));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        const existing = await this.repository.findByCode(data.code);

        if (existing && existing.id !== part.id) {
            throw new ConflictError("Ya existe una pieza con ese código.");
        }

        return this.repository.update(BigInt(id), {
            code: data.code,
            name: data.name,
            description: data.description,
            minimumStock: data.minimumStock ?? 0
        });

    }

    async delete(
        id: string
    ): Promise<Part> {

        const part = await this.repository.findById(BigInt(id));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        if (Number(part.quantity) > 0) {
            throw new ValidationError(
                "No se puede eliminar una pieza con stock disponible. Registre una descarga primero."
            );
        }

        return this.repository.delete(BigInt(id));

    }

}
