import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { AccountReceivableService } from "./account-receivable.service.js";

export class AccountReceivableController {

    private readonly service = new AccountReceivableService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const accountsReceivable = await this.service.findAll();

            res.status(200).json(
                ApiResponse.success("Cuentas de cobro obtenidas correctamente.", accountsReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

    async findByClient(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { clientId } = req.params;

            if (!clientId || Array.isArray(clientId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const accountsReceivable = await this.service.findByClient(clientId);

            res.status(200).json(
                ApiResponse.success("Cuentas de cobro obtenidas correctamente.", accountsReceivable)
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

            const accountReceivable = await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success("Cuenta de cobro obtenida correctamente.", accountReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

    async summary(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const summary = await this.service.getSummary();

            res.status(200).json(
                ApiResponse.success("Resumen obtenido correctamente.", summary)
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

            const accountReceivable = await this.service.update(id, req.body);

            res.status(200).json(
                ApiResponse.success("Cuenta de cobro actualizada correctamente.", accountReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

    async markPaid(
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

            const accountReceivable = await this.service.markPaid(id);

            res.status(200).json(
                ApiResponse.success("Cuenta de cobro marcada como pagada.", accountReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

}
