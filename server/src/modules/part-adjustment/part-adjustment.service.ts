import { PartAdjustmentRepository } from "./part-adjustment.repository.js";
import { CreatePartAdjustmentDto } from "./part-adjustment.dto.js";
import { PartMovementService } from "../part-movement/part-movement.service.js";

export class PartAdjustmentService {

    private readonly repository = new PartAdjustmentRepository();
    private readonly movementService = new PartMovementService();

    async findAll() {
        return this.repository.findAll();
    }

    async create(data: CreatePartAdjustmentDto) {

        return this.movementService.create({
            number: data.number,
            type: data.type,
            userId: data.userId,
            movementDate: new Date(),
            observations: data.reason,
            isAdjustment: true,
            details: [{ partId: data.partId, quantity: data.quantity }]
        });

    }

}
