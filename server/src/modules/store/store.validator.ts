import { z } from "zod";

import { StoreType } from "@prisma/client";

export const createStoreSchema = z.object({

    code: z
        .string()
        .trim()
        .min(1, "El código es obligatorio.")
        .max(20, "El código no puede superar los 20 caracteres."),

    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(100, "El nombre no puede superar los 100 caracteres."),

    type: z.nativeEnum(StoreType, {
        error: "El tipo de tienda es obligatorio."
    }),

    address: z
        .string()
        .trim()
        .max(200, "La dirección no puede superar los 200 caracteres.")
        .optional(),

    city: z
        .string()
        .trim()
        .max(100, "La ciudad no puede superar los 100 caracteres.")
        .optional(),

    phone: z
        .string()
        .trim()
        .max(30, "El teléfono no puede superar los 30 caracteres.")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Correo electrónico inválido.")
        .optional()
        .or(z.literal("")),

    manager: z
        .string()
        .trim()
        .max(100, "El responsable no puede superar los 100 caracteres.")
        .optional(),

    // 45 es el largo máximo de una sola IP (IPv6 completa); el campo admite varias
    // separadas por coma (ver Store.attendanceIp / findStoreByIp), así que el límite
    // debe alcanzar para varias entradas, no solo una. 500 cubre holgadamente 10.
    attendanceIp: z
        .string()
        .trim()
        .max(500, "La lista de IPs no puede superar los 500 caracteres.")
        .optional()

});

export type CreateStoreInput =
    z.infer<typeof createStoreSchema>;