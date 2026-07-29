import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { ProductService } from "./product.service.js";
import { ProductQueryService } from "./product.query.service.js";
import { AuthenticatedRequest } from "../../middleware/authenticate.js";
import { ROLES } from "../../shared/constants/roles.js";

function hideCostPrice<T extends { costPrice?: unknown }>(product: T) {

    const { costPrice, ...rest } = product;

    return rest;

}

export class ProductController {

    private readonly service = new ProductService();
    private readonly queryService = new ProductQueryService();

    async findAll(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const products = await this.queryService.findAll();

            res.status(200).json(
                ApiResponse.success(
                    "Productos obtenidos correctamente.",
                    products
                )
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
                res.status(400).json(
                    ApiResponse.error("Id inválido.")
                );
                return;
            }

            const product =
                await this.queryService.findById(id);
            if (!product) {
                res.status(404).json(
                    ApiResponse.error(
                        "Producto no encontrado."
                    )
                );
                return;
            }

            const data =
                req.user?.roleName === ROLES.STORE
                    ? hideCostPrice(product)
                    : product;

            res.status(200).json(
                ApiResponse.success(
                    "Producto obtenido correctamente.",
                    data
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
                    ApiResponse.error("Id inválido.")
                );
                return;
            }

            const body = {
                ...req.body,
                categoryId: BigInt(req.body.categoryId),
                marginProfileIds: req.body.marginProfileIds.map(
                    (id: number | string) => BigInt(id)
                )
            };

            const product =
                await this.service.update(
                    id,
                    body
                );
            res.status(200).json(
                ApiResponse.success(
                    "Producto actualizado correctamente.",
                    product
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
                    ApiResponse.error("Id inválido.")
                );
                return;
            }

            const product =
                await this.service.delete(id);
            res.status(200).json(
                ApiResponse.success(
                    "Producto eliminado correctamente.",
                    product
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
            const body = {
                ...req.body,
                categoryId: BigInt(req.body.categoryId),
                marginProfileIds: req.body.marginProfileIds.map(
                    (id: number | string) => BigInt(id)
                )
            };

            const product =
                await this.service.create(body);
            res.status(201).json(
                ApiResponse.success(
                    "Producto creado correctamente.",
                    product
                )
            );

        } catch (error) {
            next(error);
        }
    }
}