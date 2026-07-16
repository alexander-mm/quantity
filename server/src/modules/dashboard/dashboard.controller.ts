import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/responses/index.js";

import { DashboardService } from "./dashboard.service.js";

export class DashboardController {

    private readonly service = new DashboardService();

    async getDashboard(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const dashboard = await this.service.getDashboard();

            res.status(200).json(

                ApiResponse.success(

                    "Dashboard obtenido correctamente.",

                    dashboard

                )

            );

        } catch (error) {

            next(error);

        }

    }

}