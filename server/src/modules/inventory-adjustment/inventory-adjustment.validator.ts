import { z } from "zod";

export const createInventoryAdjustmentSchema = z.object({

    productId: z
        .string()
        .trim()
        .min(1, "El producto es obligatorio."),

    storeId: z
        .string()
        .trim()
        .min(1, "La tienda es obligatoria."),

    userId: z
        .string()
        .trim()
        .min(1, "El usuario es obligatorio."),

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
