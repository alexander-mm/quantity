import { Response, NextFunction } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { DamagedPartService } from "./damaged-part.service.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

export class DamagedPartController {

    private readonly service = new DamagedPartService();

    async findAll(
        _req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const parts = await this.service.findAll();
            res.status(200).json(
                ApiResponse.success(
                    "Piezas dañadas obtenidas correctamente.",
                    parts
                )
            );
        } catch (error) {
            next(error);
        }
    }
}
