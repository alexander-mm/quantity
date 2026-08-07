import { z } from "zod";

export const createPartCuttingOrderSchema = z.object({

    number: z
        .string()
        .trim()
        .min(1, "El número es obligatorio.")
        .max(50, "El número no puede superar los 50 caracteres."),

    partId: z
        .string()
        .trim()
        .min(1, "Seleccione la pieza a cortar."),

    rawMaterialQtyUsed: z
        .coerce
        .number()
        .positive("La cantidad de materia prima debe ser mayor que cero."),

    observations: z
        .string()
        .trim()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional()

});

export const updatePartCuttingOrderSchema = createPartCuttingOrderSchema;

export const confirmPartCuttingOrderSchema = z.object({

    goodPieces: z
        .coerce
        .number()
        .min(0, "No puede ser negativo."),

    defectivePieces: z
        .coerce
        .number()
        .min(0, "No puede ser negativo.")
        .optional()

}).refine(
    data => data.goodPieces > 0 || (data.defectivePieces ?? 0) > 0,
    { message: "Debe registrar al menos una pieza buena o dañada.", path: ["goodPieces"] }
);
