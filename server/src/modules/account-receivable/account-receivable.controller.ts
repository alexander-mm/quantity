import { NextFunction, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";

import { AccountReceivableService } from "./account-receivable.service.js";

export class AccountReceivableController {

    private readonly service = new AccountReceivableService();

    async findAll(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const accountsReceivable = await this.service.findAll(req.user);

            res.status(200).json(
                ApiResponse.success("Cuentas de cobro obtenidas correctamente.", accountsReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

    async nextNumber(
        _req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const number = await this.service.previewNextNumber();

            res.status(200).json(
                ApiResponse.success("Número obtenido correctamente.", { number })
            );

        } catch (error) {
            next(error);
        }

    }

    async findByClient(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { clientId } = req.params;

            if (!clientId || Array.isArray(clientId)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const accountsReceivable = await this.service.findByClient(clientId, req.user);

            res.status(200).json(
                ApiResponse.success("Cuentas de cobro obtenidas correctamente.", accountsReceivable)
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

            const accountReceivable = await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success("Cuenta de cobro obtenida correctamente.", accountReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

    async summary(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const summary = await this.service.getSummary(req.user);

            res.status(200).json(
                ApiResponse.success("Resumen obtenido correctamente.", summary)
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

            const accountReceivable = await this.service.update(id, req.body, req.user);

            res.status(200).json(
                ApiResponse.success("Cuenta de cobro actualizada correctamente.", accountReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

    async createPayment(
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

            const accountReceivable = await this.service.createPayment(
                id,
                req.body,
                req.user?.userId,
                req.user
            );

            res.status(200).json(
                ApiResponse.success("Abono registrado correctamente.", accountReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

    async markPaid(
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

            const accountReceivable = await this.service.markPaid(id, req.user);

            res.status(200).json(
                ApiResponse.success("Cuenta de cobro marcada como pagada.", accountReceivable)
            );

        } catch (error) {

            next(error);

        }

    }

}
