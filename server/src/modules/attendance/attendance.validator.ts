import { z } from "zod";

export const clockAttendanceSchema = z.object({

    userId: z
        .string()
        .trim()
        .min(1, "Seleccione un empleado."),

    pin: z
        .string()
        .trim()
        .regex(/^\d{4}$/, "El PIN debe ser de 4 dígitos numéricos."),

    reason: z
        .string()
        .trim()
        .max(200, "El motivo no puede superar los 200 caracteres.")
        .optional()

});

export const setAttendancePinSchema = z.object({

    pin: z
        .string()
        .trim()
        .regex(/^\d{4}$/, "El PIN debe ser de 4 dígitos numéricos.")

});

export const enrollOptionsSchema = z.object({

    username: z
        .string()
        .trim()
        .min(1, "Ingrese el usuario."),

    password: z
        .string()
        .min(1, "Ingrese la contraseña.")

});

export const enrollDeviceSchema = enrollOptionsSchema.extend({

    storeId: z
        .string()
        .trim()
        .regex(/^\d+$/, "Seleccione una tienda."),

    name: z
        .string()
        .trim()
        .min(1, "Ingrese un nombre para el equipo.")
        .max(100, "El nombre no puede superar los 100 caracteres.")

});
