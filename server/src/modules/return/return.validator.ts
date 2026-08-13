import { z } from "zod";

export const createReturnSchema = z.object({

    number: z
        .string()
        .trim()
        .min(1, "El número es obligatorio.")
        .max(50, "El número no puede superar los 50 caracteres."),

    saleId: z.string().optional(),

    saleDetailId: z.string().optional(),

    productId: z
        .string()
        .min(1, "El producto es obligatorio."),

    storeId: z
        .string()
        .min(1, "La tienda es obligatoria."),

    quantity: z
        .coerce
        .number()
        .positive("La cantidad debe ser mayor que cero."),

    reason: z.enum([
        "DAMAGED",
        "CUSTOMER_CHANGED_MIND",
        "WRONG_ITEM",
        "INCOMPATIBLE",
        "WARRANTY",
        "OTHER"
    ]),

    notes: z
        .string()
        .trim()
        .max(500, "Las notas no pueden superar los 500 caracteres.")
        .optional(),

    returnDate: z.coerce.date(),

    disposition: z.enum(["RESTOCK", "DAMAGED"]).optional()

});

export const resolveReturnSchema = z.object({

    disposition: z.enum(["RESTOCK", "DAMAGED"], {
        error: "Debes indicar el destino de la devolución."
    })

});
