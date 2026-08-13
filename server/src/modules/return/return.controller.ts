import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { ReturnService } from "./return.service.js";

export class ReturnController {

    private readonly service = new ReturnService();

    async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const returns = await this.service.findAll();
            res.status(200).json(ApiResponse.success("Devoluciones obtenidas correctamente.", returns));
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }
            const item = await this.service.findById(id);
            res.status(200).json(ApiResponse.success("Devolución obtenida correctamente.", item));
        } catch (error) {
            next(error);
        }
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = { ...req.body, userId: req.user!.userId };
            const item = await this.service.create(body);
            res.status(201).json(ApiResponse.success("Devolución registrada correctamente.", item));
        } catch (error) {
            next(error);
        }
    }

    async resolve(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }
            const body = { ...req.body, userId: req.user!.userId };
            const item = await this.service.resolve(id, body);
            res.status(200).json(ApiResponse.success("Devolución resuelta correctamente.", item));
        } catch (error) {
            next(error);
        }
    }

}
