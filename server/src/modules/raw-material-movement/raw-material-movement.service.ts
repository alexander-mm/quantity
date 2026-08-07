import { Prisma } from "@prisma/client";

import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { RawMaterialRepository } from "../raw-material/raw-material.repository.js";

import { RawMaterialMovementRepository } from "./raw-material-movement.repository.js";
import { CreateRawMaterialMovementDto } from "./raw-material-movement.dto.js";

export class RawMaterialMovementService {

    private readonly repository = new RawMaterialMovementRepository();
    private readonly rawMaterialRepository = new RawMaterialRepository();

    async findAll() {
        return this.repository.findAll();
    }

    async findById(id: string) {

        const movement = await this.repository.findById(BigInt(id));

        if (!movement) {
            throw new NotFoundError("Movimiento no encontrado.");
        }

        return movement;

    }

    async create(data: CreateRawMaterialMovementDto) {

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe un movimiento con ese número.");
        }

        if (data.details.length === 0) {
            throw new ValidationError("El movimiento no tiene materia prima.");
        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const rawMaterialRepository = this.rawMaterialRepository.withTransaction(tx);

            for (const detail of data.details) {

                const rawMaterial = await rawMaterialRepository.findById(BigInt(detail.rawMaterialId));

                if (!rawMaterial) {
                    throw new NotFoundError("Una de las materias primas seleccionadas no existe.");
                }

                if (data.type === "OUT" && Number(rawMaterial.quantity) < detail.quantity) {
                    throw new ValidationError(
                        `Stock insuficiente de "${rawMaterial.name}": disponible ${Number(rawMaterial.quantity)}, solicitado ${detail.quantity}.`
                    );
                }

                const quantity = new Prisma.Decimal(detail.quantity);

                if (data.type === "IN") {
                    await rawMaterialRepository.incrementQuantity(rawMaterial.id, quantity);
                } else {
                    await rawMaterialRepository.decrementQuantity(rawMaterial.id, quantity);
                }

            }

            return repository.create(data);

        });

    }

}
