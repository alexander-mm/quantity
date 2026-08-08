import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { InventoryStockService } from "./inventory-stock.service.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { ROLES } from "../../shared/constants/roles.js";

export class InventoryStockController {

    private readonly service = new InventoryStockService();

    async findAll(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stock =
                req.user?.roleName === ROLES.STORE
                    ? await this.service.findAllForStore(req.user.storeId)
                    : await this.service.findAll();
            res.status(200).json(
                ApiResponse.success(
                    "Inventario obtenido correctamente.",
                    stock
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
            const stock = await this.service.findById(id);
            res.status(200).json(
                ApiResponse.success(
                    "Registro obtenido correctamente.",
                    stock
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async findByProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { productId } = req.params;
            if (!productId || Array.isArray(productId)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Producto inválido."
                    )
                );
                return;
            }
            const stock = await this.service.findByProduct(productId);
            res.status(200).json(
                ApiResponse.success(
                    "Inventario obtenido correctamente.",
                    stock
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async findByStore(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { storeId } = req.params;
            if (!storeId || Array.isArray(storeId)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Tienda inválida."
                    )
                );
                return;
            }
            const stock = await this.service.findByStore(storeId);
            res.status(200).json(
                ApiResponse.success(
                    "Inventario obtenido correctamente.",
                    stock
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async findLowStock(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stock =
                req.user?.roleName === ROLES.STORE
                    ? await this.service.findLowStock(req.user.storeId)
                    : await this.service.findLowStock();
            res.status(200).json(
                ApiResponse.success(
                    "Productos con bajo inventario obtenidos correctamente.",
                    stock
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async findMediumStock(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stock =
                req.user?.roleName === ROLES.STORE
                    ? await this.service.findMediumStock(req.user.storeId)
                    : await this.service.findMediumStock();
            res.status(200).json(
                ApiResponse.success(
                    "Productos con inventario medio obtenidos correctamente.",
                    stock
                )
            );
        } catch (error) {
            next(error);
        }
    }
}