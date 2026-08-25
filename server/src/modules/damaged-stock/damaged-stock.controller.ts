import { Response, NextFunction } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { DamagedStockService } from "./damaged-stock.service.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

export class DamagedStockController {

    private readonly service = new DamagedStockService();

    async findAll(
        _req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stock = await this.service.findAll();
            res.status(200).json(
                ApiResponse.success(
                    "Inventario dañado obtenido correctamente.",
                    stock
                )
            );
        } catch (error) {
            next(error);
        }
    }
}
