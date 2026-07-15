import { z } from "zod";

export const createMarginProfileSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(100, "El nombre no puede superar los 100 caracteres."),

    percentage: z
        .number({
            error: "El porcentaje es obligatorio."
        })
        .min(0, "El porcentaje no puede ser negativo.")
        .max(1000, "El porcentaje no puede ser mayor a 1000."),

    displayOrder: z
        .number({
            error: "El orden es obligatorio."
        })
        .int("El orden debe ser un número entero.")
        .min(1, "El orden debe ser mayor que cero.")

});