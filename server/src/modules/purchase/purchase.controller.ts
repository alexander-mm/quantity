import { NextFunction, Request, Response } from "express";
import { PurchaseService } from "./purchase.service.js";
import { ApiResponse } from "../../shared/responses/index.js";

export class PurchaseController {

    private readonly service = new PurchaseService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const purchases = await this.service.findAll();
            res.status(200).json(
                ApiResponse.success(
                    "Compras obtenidas correctamente.",
                    purchases
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async findById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }
            const purchase = await this.service.findById(id);
            res.status(200).json(
                ApiResponse.success(
                    "Compra obtenida correctamente.",
                    purchase
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const purchase = await this.service.create(
                req.body
            );
            res.status(201).json(
                ApiResponse.success(
                    "Compra creada correctamente.",
                    purchase
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }
            const purchase = await this.service.update(
                id,
                req.body
            );
            res.status(200).json(
                ApiResponse.success(
                    "Compra actualizada correctamente.",
                    purchase
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }
            await this.service.delete(id);
            res.status(200).json(
                ApiResponse.success(
                    "Compra eliminada correctamente."
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async confirm(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }

            const purchase =
                await this.service.confirm(id);

            res.status(200).json(
                ApiResponse.success(
                    "Compra confirmada correctamente.",
                    purchase
                )
            );

        } catch (error) {
            next(error);
        }
    }

}