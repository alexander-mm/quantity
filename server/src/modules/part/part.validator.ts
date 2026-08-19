import { z } from "zod";

export const createPartSchema = z.object({

    code: z
        .string()
        .trim()
        .min(1, "El código es obligatorio.")
        .max(50, "El código no puede superar los 50 caracteres."),

    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(150, "El nombre no puede superar los 150 caracteres."),

    description: z
        .string()
        .trim()
        .max(500, "La descripción no puede superar los 500 caracteres.")
        .optional(),

    categoryId: z
        .string()
        .trim()
        .min(1, "Seleccione una categoría.")
        .optional(),

    minimumStock: z
        .coerce
        .number()
        .min(0, "El stock mínimo no puede ser negativo.")
        .optional(),

    initialQuantity: z
        .coerce
        .number()
        .min(0, "No puede ser negativo.")
        .optional()

});

export const updatePartSchema = createPartSchema.omit({ initialQuantity: true });
