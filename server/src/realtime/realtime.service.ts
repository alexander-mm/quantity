import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { JwtService } from "../shared/auth/jwt.service.js";
import { ROLES } from "../shared/constants/roles.js";

let io: SocketIOServer | null = null;

// Notificaciones en vivo (ventas, stock bajo, órdenes de corte, cambios de
// precio) solo para Administrador: los sockets de cualquier otro rol se
// rechazan en el handshake, así que cualquier socket conectado ya es admin
// y basta con un broadcast simple (sin rooms).
export function initRealtime(
    httpServer: HttpServer
): void {

    io = new SocketIOServer(httpServer, {
        cors: {
            origin: true
        }
    });

    io.use((socket, next) => {

        const token = socket.handshake.auth?.token as string | undefined;

        if (!token) {
            next(new Error("No autorizado."));
            return;
        }

        try {

            const payload = JwtService.verifyToken(token);

            if (payload.roleName !== ROLES.ADMIN) {
                next(new Error("No autorizado."));
                return;
            }

            next();

        } catch {
            next(new Error("No autorizado."));
        }

    });

}

export function notifyAdmins(
    event: string,
    payload: unknown
): void {

    io?.emit(event, payload);

}
