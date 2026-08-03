import { NextFunction, Response } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { StockTransferService } from "./stock-transfer.service.js";

export class StockTransferController {

    private readonly service = new StockTransferService();

    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const transfers =
                req.user?.roleName === ROLES.ADMIN
                    ? await this.service.findAll()
                    : await this.service.findAllForUser(req.user!.storeId, req.user!.userId);
            res.status(200).json(ApiResponse.success("Envíos obtenidos correctamente.", transfers));
        } catch (error) {
            next(error);
        }
    }

    async findById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }
            const transfer = await this.service.findById(id);
            res.status(200).json(ApiResponse.success("Envío obtenido correctamente.", transfer));
        } catch (error) {
            next(error);
        }
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            if (
                req.user?.roleName !== ROLES.ADMIN &&
                req.body.originStoreId !== req.user?.storeId
            ) {
                res.status(403).json(ApiResponse.error("Solo puedes despachar desde tu propia tienda."));
                return;
            }

            const body = { ...req.body, userId: req.user!.userId };
            const transfer = await this.service.create(body);
            res.status(201).json(ApiResponse.success("Envío despachado correctamente.", transfer));
        } catch (error) {
            next(error);
        }
    }


    async confirm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const transfer = await this.service.findById(id);

            const isOwner =
                req.user?.roleName === ROLES.ADMIN ||
                (transfer.destType === "STORE" && transfer.destStoreId?.toString() === req.user?.storeId) ||
                (transfer.destType === "TECHNICIAN" && transfer.destUserId?.toString() === req.user?.userId);

            if (!isOwner) {
                res.status(403).json(ApiResponse.error("No tienes permiso sobre este envío."));
                return;
            }

            const confirmed = await this.service.confirmReceipt(id, req.user!.userId);
            res.status(200).json(ApiResponse.success("Recepción confirmada correctamente.", confirmed));
        } catch (error) {
            next(error);
        }
    }

    async reportIssue(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json(ApiResponse.error("Id inválido."));
                return;
            }

            const transfer = await this.service.findById(id);

            const isOwner =
                req.user?.roleName === ROLES.ADMIN ||
                (transfer.destType === "STORE" && transfer.destStoreId?.toString() === req.user?.storeId) ||
                (transfer.destType === "TECHNICIAN" && transfer.destUserId?.toString() === req.user?.userId);

            if (!isOwner) {
                res.status(403).json(ApiResponse.error("No tienes permiso sobre este envío."));
                return;
            }

            const updated = await this.service.reportIssue(id, req.body);
            res.status(200).json(ApiResponse.success("Novedad registrada correctamente.", updated));
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
            const updated = await this.service.resolve(id, req.body);
            res.status(200).json(ApiResponse.success("Novedad resuelta correctamente.", updated));
        } catch (error) {
            next(error);
        }
    }

}
