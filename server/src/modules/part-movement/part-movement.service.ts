import { Prisma } from "@prisma/client";

import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";

import { PartMovementRepository } from "./part-movement.repository.js";
import { CreatePartMovementDto } from "./part-movement.dto.js";

export class PartMovementService {

    private readonly repository = new PartMovementRepository();
    private readonly partRepository = new PartRepository();

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

    async create(data: CreatePartMovementDto) {

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe un movimiento con ese número.");
        }

        if (data.details.length === 0) {
            throw new ValidationError("El movimiento no tiene piezas.");
        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const partRepository = this.partRepository.withTransaction(tx);

            for (const detail of data.details) {

                const part = await partRepository.findById(BigInt(detail.partId));

                if (!part) {
                    throw new NotFoundError("Una de las piezas seleccionadas no existe.");
                }

                if (data.type === "OUT" && Number(part.quantity) < detail.quantity) {
                    throw new ValidationError(
                        `Stock insuficiente de "${part.name}": disponible ${Number(part.quantity)}, solicitado ${detail.quantity}.`
                    );
                }

                const quantity = new Prisma.Decimal(detail.quantity);

                if (data.type === "IN") {
                    await partRepository.incrementQuantity(part.id, quantity);
                } else {
                    await partRepository.decrementQuantity(part.id, quantity);
                }

            }

            return repository.create(data);

        });

    }

}
