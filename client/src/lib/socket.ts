import { io, type Socket } from "socket.io-client";
import { env } from "@/config/env";

let socket: Socket | null = null;

function getSocketUrl(): string {
    return env.apiUrl.replace(/\/api\/?$/, "");
}

export function connectSocket(token: string): Socket {

    disconnectSocket();

    socket = io(getSocketUrl(), {
        auth: { token }
    });

    return socket;

}

export function disconnectSocket(): void {

    socket?.disconnect();
    socket = null;

}
