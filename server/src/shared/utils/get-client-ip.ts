import { Request } from "express";

// Normaliza direcciones IPv4 mapeadas a IPv6 (ej. "::ffff:190.90.1.2" -> "190.90.1.2")
// para que coincidan con la IP que el admin registra en la tienda.
export function getClientIp(req: Request): string {

    const ip = req.ip ?? "";

    return ip.startsWith("::ffff:") ? ip.slice(7) : ip;

}
