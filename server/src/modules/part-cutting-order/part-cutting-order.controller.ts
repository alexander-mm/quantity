import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

import { PartCuttingOrderService } from "./part-cutting-order.service.js";

export class PartCuttingOrderController {

    private readonly service = new PartCuttingOrderService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const orders = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Órdenes de corte obtenidas correctamente.", orders)
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
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const order = await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success("Orden de corte obtenida correctamente.", order)
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

            const body = { ...req.body, userId: req.user!.userId };

            const order = await this.service.create(body);

            res.status(201).json(
                ApiResponse.success("Orden de corte registrada como borrador.", order)
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
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const order = await this.service.update(id, req.body);

            res.status(200).json(
                ApiResponse.success("Orden de corte actualizada correctamente.", order)
            );

        } catch (error) {

            next(error);

        }

    }

    async confirm(
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

            const order = await this.service.confirm(id, req.user!.userId, req.body);

            res.status(200).json(
                ApiResponse.success("Orden de corte confirmada: inventario actualizado.", order)
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
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            await this.service.cancel(id);

            res.status(200).json(
                ApiResponse.success("Orden de corte eliminada correctamente.")
            );

        } catch (error) {

            next(error);

        }

    }

}
