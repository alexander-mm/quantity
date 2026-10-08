import { Request } from "express";

// Token secreto del equipo autorizado para el reloj checador (ver AttendanceDevice).
// Se genera con randomBytes(48) en hex, así que cualquier otra cosa se descarta.
const DEVICE_TOKEN_PATTERN = /^[a-f0-9]{96}$/;

export function getAttendanceDeviceToken(req: Request): string | null {

    const token = req.get("x-attendance-device-token")?.trim() ?? "";

    return DEVICE_TOKEN_PATTERN.test(token) ? token : null;

}
