import { RawMaterialAdjustmentRepository } from "./raw-material-adjustment.repository.js";
import { CreateRawMaterialAdjustmentDto } from "./raw-material-adjustment.dto.js";
import { RawMaterialMovementService } from "../raw-material-movement/raw-material-movement.service.js";

export class RawMaterialAdjustmentService {

    private readonly repository = new RawMaterialAdjustmentRepository();
    private readonly movementService = new RawMaterialMovementService();

    async findAll() {
        return this.repository.findAll();
    }

    async create(data: CreateRawMaterialAdjustmentDto) {

        return this.movementService.create({
            number: data.number,
            type: data.type,
            userId: data.userId,
            movementDate: new Date(),
            observations: data.reason,
            isAdjustment: true,
            details: [{ rawMaterialId: data.rawMaterialId, quantity: data.quantity }]
        });

    }

}
