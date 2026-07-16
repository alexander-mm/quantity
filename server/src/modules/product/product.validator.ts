import { z } from "zod";

export const createProductSchema = z.object({

    internalCode: z
        .string()
        .trim()
        .min(1, "El código interno es obligatorio.")
        .max(50, "El código interno no puede superar los 50 caracteres."),

    barcode: z
        .string()
        .trim()
        .max(100, "El código de barras no puede superar los 100 caracteres.")
        .optional()
        .nullable(),

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

brandId: z
    .number({
        error: "La marca es obligatoria."
    })
    .int()
    .positive(),

categoryId: z
    .number({
        error: "La categoría es obligatoria."
    })
    .int()
    .positive(),

unitOfMeasureId: z
    .number({
        error: "La unidad de medida es obligatoria."
    })
    .int()
    .positive(),

marginProfileId: z
    .number({
        error: "El perfil de margen es obligatorio."
    })
    .int()
    .positive(),

    costPrice: z
        .number({
            error: "El costo es obligatorio."
        })
        .nonnegative("El costo no puede ser negativo."),

    minimumStock: z
        .number({
            error: "El stock mínimo es obligatorio."
        })
        .nonnegative("El stock mínimo no puede ser negativo.")

});