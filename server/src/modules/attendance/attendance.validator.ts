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
