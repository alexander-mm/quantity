import { Response, NextFunction } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { QuoteService } from "./quote.service.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

export class QuoteController {

    private readonly service = new QuoteService();

    async findAll(
        _req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const quotes = await this.service.findAll();
            res.status(200).json(
                ApiResponse.success("Cotizaciones obtenidas correctamente.", quotes)
            );
        } catch (error) {
            next(error);
        }
    }

    async findById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }
            const quote = await this.service.findById(id);
            res.status(200).json(
                ApiResponse.success("Cotización obtenida correctamente.", quote)
            );
        } catch (error) {
            next(error);
        }
    }

    async create(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.user!.userId;
            const quote = await this.service.create({ ...req.body, userId });
            res.status(201).json(
                ApiResponse.success("Cotización registrada correctamente.", quote)
            );
        } catch (error) {
            next(error);
        }
    }

    async update(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }
            const quote = await this.service.update(id, req.body);
            res.status(200).json(
                ApiResponse.success("Cotización actualizada correctamente.", quote)
            );
        } catch (error) {
            next(error);
        }
    }

    async delete(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }
            await this.service.delete(id);
            res.status(200).json(
                ApiResponse.success("Cotización eliminada correctamente.", null)
            );
        } catch (error) {
            next(error);
        }
    }

    async convert(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }
            const quote = await this.service.convert(id, req.body);
            res.status(200).json(
                ApiResponse.success("Cotización marcada como convertida.", quote)
            );
        } catch (error) {
            next(error);
        }
    }

}
