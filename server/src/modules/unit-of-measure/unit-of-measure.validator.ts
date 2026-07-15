import { z } from "zod";

export const createUnitOfMeasureSchema = z.object({

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

    description: z
        .string()
        .trim()
        .max(255, "La descripción no puede superar los 255 caracteres.")
        .optional()

});