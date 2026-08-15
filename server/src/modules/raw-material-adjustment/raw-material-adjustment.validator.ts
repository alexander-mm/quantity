import { z } from "zod";

export const createRawMaterialAdjustmentSchema = z.object({

    number: z
        .string()
        .trim()
        .min(1, "El número es obligatorio."),

    rawMaterialId: z
        .string()
        .trim()
        .min(1, "La materia prima es obligatoria."),

    type: z.enum(
        ["IN", "OUT"],
        {
            message: "El tipo de ajuste debe ser IN u OUT."
        }
    ),

    quantity: z.coerce
        .number()
        .positive("La cantidad debe ser mayor que cero."),

    reason: z
        .string()
        .trim()
        .min(1, "Debes indicar el motivo del ajuste.")
        .max(255)

});
