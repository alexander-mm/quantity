import { NextFunction, Request, Response } from "express";
import { SaleService } from "./sale.service.js";
import { ApiResponse } from "../../shared/responses/index.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { ROLES } from "../../shared/constants/roles.js";

export class SaleController {

    private readonly service = new SaleService();

    async findAll(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const sales = await this.service.findAll(req.user);
            res.status(200).json(
                ApiResponse.success(
                    "Ventas obtenidas correctamente.",
                    sales
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
            const sale = await this.service.findById(id);
            res.status(200).json(
                ApiResponse.success(
                    "Venta obtenida correctamente.",
                    sale
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async previewNextNumber(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { storeId } = req.params;
            if (!storeId || Array.isArray(storeId)) {
                res.status(400).json(
                    ApiResponse.error(
                        "Id de tienda inválido."
                    )
                );
                return;
            }

            if (
                req.user?.roleName === ROLES.STORE &&
                storeId !== req.user.storeId
            ) {
                res.status(403).json(
                    ApiResponse.error(
                        "Solo puedes consultar el número de tu propia tienda."
                    )
                );
                return;
            }

            const number = await this.service.previewNextNumber(storeId);
            res.status(200).json(
                ApiResponse.success(
                    "Número obtenido correctamente.",
                    { number }
                )
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

            if (
                req.user?.roleName === ROLES.STORE &&
                req.body.storeId !== req.user.storeId
            ) {
                res.status(403).json(
                    ApiResponse.error(
                        "Solo puedes registrar ventas para tu propia tienda."
                    )
                );
                return;
            }

            const sale = await this.service.create(
                req.body
            );
            res.status(201).json(
                ApiResponse.success(
                    "Venta creada correctamente.",
                    sale
                )
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
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }

            if (
                req.user?.roleName === ROLES.STORE &&
                req.body.storeId !== req.user.storeId
            ) {
                res.status(403).json(
                    ApiResponse.error(
                        "Solo puedes editar ventas de tu propia tienda."
                    )
                );
                return;
            }

            const sale = await this.service.update(
                id,
                req.body,
                req.user
            );
            res.status(200).json(
                ApiResponse.success(
                    "Venta actualizada correctamente.",
                    sale
                )
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
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }
            await this.service.delete(id, req.user);
            res.status(200).json(
                ApiResponse.success(
                    "Venta eliminada correctamente."
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

            const sale =
                await this.service.confirm(id);

            res.status(200).json(
                ApiResponse.success(
                    "Venta confirmada correctamente.",
                    sale
                )
            );

        } catch (error) {
            next(error);
        }
    }

}
