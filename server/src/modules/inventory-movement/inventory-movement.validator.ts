import { z } from "zod";

export const createInventoryMovementSchema = z.object({

    movementTypeId: z.coerce
        .bigint({
            message: "El tipo de movimiento es obligatorio."
        }),

    productId: z.coerce
        .bigint({
            message: "El producto es obligatorio."
        }),

    storeId: z.coerce
        .bigint({
            message: "La tienda es obligatoria."
        }),

    userId: z.coerce
        .bigint({
            message: "El usuario es obligatorio."
        }),

    clientId: z.coerce
        .bigint()
        .optional(),

    quantity: z.coerce
        .number()
        .positive("La cantidad debe ser mayor que cero."),

    unitCost: z.coerce
        .number()
        .min(0, "El costo unitario no puede ser negativo."),

    observations: z
        .string()
        .trim()
        .max(255)
        .optional(),

    movementDate: z.coerce.date()

});