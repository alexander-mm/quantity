import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/responses/index.js";
import { getClientIp } from "../../shared/utils/get-client-ip.js";
import { getAttendanceDeviceToken } from "../../shared/utils/get-attendance-device-token.js";
import { AttendanceService } from "./attendance.service.js";

export class AttendanceController {

    private readonly service = new AttendanceService();

    async kioskContext(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const context = await this.service.getKioskContext(
                getClientIp(req),
                getAttendanceDeviceToken(req)
            );

            res.status(200).json(
                ApiResponse.success(
                    "Contexto de asistencia obtenido correctamente.",
                    context
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async clock(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { userId, pin, reason } = req.body;

            const result = await this.service.clock(
                getClientIp(req),
                getAttendanceDeviceToken(req),
                userId,
                pin,
                reason
            );

            const message = result.action === "clock-in"
                ? "Entrada registrada correctamente."
                : "Salida registrada correctamente.";

            res.status(200).json(
                ApiResponse.success(message, result)
            );

        } catch (error) {
            next(error);
        }

    }

    async findAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { storeId, userId, from, to } = req.query;

            const records = await this.service.findAll({
                storeId: typeof storeId === "string" ? storeId : undefined,
                userId: typeof userId === "string" ? userId : undefined,
                from: typeof from === "string" ? from : undefined,
                to: typeof to === "string" ? to : undefined
            });

            res.status(200).json(
                ApiResponse.success(
                    "Historial de asistencia obtenido correctamente.",
                    records
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async setPin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { userId } = req.params;

            if (!userId || Array.isArray(userId)) {
                res.status(400).json(
                    ApiResponse.error("Id inválido.")
                );
                return;
            }

            const { pin } = req.body;

            const employee = await this.service.setPin(userId, pin);

            res.status(200).json(
                ApiResponse.success(
                    "PIN de asistencia configurado correctamente.",
                    employee
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async enrollOptions(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { username, password } = req.body;

            const stores = await this.service.getEnrollableStores(username, password);

            res.status(200).json(
                ApiResponse.success(
                    "Tiendas disponibles obtenidas correctamente.",
                    stores
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async enrollDevice(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { username, password, storeId, name } = req.body;

            const result = await this.service.enrollDevice(
                getClientIp(req),
                username,
                password,
                storeId,
                name
            );

            res.status(201).json(
                ApiResponse.success(
                    "Equipo autorizado correctamente.",
                    result
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async findDevices(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { storeId } = req.query;

            const devices = await this.service.findDevices(
                typeof storeId === "string" ? storeId : undefined
            );

            res.status(200).json(
                ApiResponse.success(
                    "Equipos autorizados obtenidos correctamente.",
                    devices
                )
            );

        } catch (error) {
            next(error);
        }

    }

    async revokeDevice(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const { id } = req.params;

            if (!id || Array.isArray(id) || !/^\d+$/.test(id)) {
                res.status(400).json(
                    ApiResponse.error("Id inválido.")
                );
                return;
            }

            await this.service.revokeDevice(id);

            res.status(200).json(
                ApiResponse.success("Autorización del equipo revocada correctamente.")
            );

        } catch (error) {
            next(error);
        }

    }

}
