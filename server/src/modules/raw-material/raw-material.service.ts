import { Prisma } from "@prisma/client";

import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { RawMaterialMovementRepository } from "../raw-material-movement/raw-material-movement.repository.js";
import { PartCostCalculationService } from "../part/part-cost-calculation.service.js";

import { RawMaterialRepository } from "./raw-material.repository.js";
import { CreateRawMaterialDto, UpdateRawMaterialDto } from "./raw-material.dto.js";

export class RawMaterialService {

    private readonly repository = new RawMaterialRepository();
    private readonly movementRepository = new RawMaterialMovementRepository();
    private readonly costCalculationService = new PartCostCalculationService();

    async findAll() {

        return this.repository.findAll();

    }

    async findLowStock() {

        return this.repository.findLowStock();

    }

    async findMediumStock() {

        return this.repository.findMediumStock();

    }

    async findByCode(
        code: string
    ) {

        return this.repository.findByCode(code);

    }

    async findById(
        id: string
    ) {

        const rawMaterial = await this.repository.findById(BigInt(id));

        if (!rawMaterial) {
            throw new NotFoundError("Materia prima no encontrada.");
        }

        return rawMaterial;

    }

    async updateMinimumStock(
        id: string,
        minimumStock: number
    ) {

        const rawMaterial = await this.repository.findById(BigInt(id));

        if (!rawMaterial) {
            throw new NotFoundError("Materia prima no encontrada.");
        }

        return this.repository.update(BigInt(id), { minimumStock });

    }

    private buildAttributes(data: CreateRawMaterialDto | UpdateRawMaterialDto) {

        return {
            code: data.code,
            name: data.name,
            shape: data.shape,
            material: data.material,
            thickness: data.thickness,
            width: data.width ?? null,
            height: (data.shape === "SHEET" ? data.height : (data.profile === "RECTANGULAR" ? data.height : null)) ?? null,
            length: ((data.shape === "TUBE" || data.shape === "ROD") ? data.length : null) ?? null,
            profile: (data.shape === "TUBE" ? data.profile : null) ?? null,
            minimumStock: data.minimumStock ?? 0,
            cost: data.cost ?? null,
            wastePercentage: data.wastePercentage ?? null,
            laserCostPerMeter: data.laserCostPerMeter ?? null,
            mechanicalCutCost: data.mechanicalCutCost ?? null,
            bendCostPerBend: data.bendCostPerBend ?? null,
            curveCostPerCurve: data.curveCostPerCurve ?? null
        };

    }

    async create(
        data: CreateRawMaterialDto
    ) {

        const existing = await this.repository.findByCode(data.code);

        if (existing) {
            throw new ConflictError("Ya existe una materia prima con ese código.");
        }

        const attributes = this.buildAttributes(data);

        if (!data.initialQuantity || data.initialQuantity <= 0) {

            return this.repository.create(attributes);

        }

        return prisma.$transaction(async (tx) => {

            const rawMaterialRepository = this.repository.withTransaction(tx);
            const movementRepository = this.movementRepository.withTransaction(tx);

            const rawMaterial = await rawMaterialRepository.create(attributes);

            await movementRepository.create({
                number: `CARGA-${rawMaterial.code}-${Date.now()}`,
                type: "IN",
                userId: data.userId,
                movementDate: new Date(),
                observations: "Carga inicial al registrar la materia prima.",
                details: [{
                    rawMaterialId: rawMaterial.id.toString(),
                    quantity: data.initialQuantity!
                }]
            });

            return rawMaterialRepository.incrementQuantity(
                rawMaterial.id,
                new Prisma.Decimal(data.initialQuantity!)
            );

        });

    }

    async update(
        id: string,
        data: UpdateRawMaterialDto
    ) {

        const rawMaterial = await this.repository.findById(BigInt(id));

        if (!rawMaterial) {
            throw new NotFoundError("Materia prima no encontrada.");
        }

        const existing = await this.repository.findByCode(data.code);

        if (existing && existing.id !== rawMaterial.id) {
            throw new ConflictError("Ya existe una materia prima con ese código.");
        }

        const updated = await this.repository.update(BigInt(id), this.buildAttributes(data));

        await this.costCalculationService.recalculateForRawMaterial(BigInt(id));

        return updated;

    }

    async delete(
        id: string
    ) {

        const rawMaterial = await this.repository.findById(BigInt(id));

        if (!rawMaterial) {
            throw new NotFoundError("Materia prima no encontrada.");
        }

        if (Number(rawMaterial.quantity) > 0) {
            throw new ValidationError(
                "No se puede eliminar una materia prima con stock disponible. Registre una salida primero."
            );
        }

        return this.repository.delete(BigInt(id));

    }

}
