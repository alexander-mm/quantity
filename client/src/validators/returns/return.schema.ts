import { z } from "zod";

export const returnSchema = z.object({

    number: z.string().trim().min(1, "El número es obligatorio.").max(50, "Máximo 50 caracteres."),

    saleId: z.string().optional(),

    saleDetailId: z.string().optional(),

    assemblyId: z.string().optional(),

    productId: z.string().optional(),

    partId: z.string().optional(),

    storeId: z.string().min(1, "Selecciona la tienda."),

    quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("Debe ser mayor que cero."),

    reason: z.enum([
        "DAMAGED",
        "CUSTOMER_CHANGED_MIND",
        "WRONG_ITEM",
        "INCOMPATIBLE",
        "WARRANTY",
        "FACTORY_DEFECT",
        "OTHER"
    ], { error: "Selecciona un motivo." }),

    notes: z.string().trim().max(500, "Máximo 500 caracteres.").optional(),

    returnDate: z.string().min(1, "La fecha es obligatoria."),

    disposition: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.enum(["RESTOCK", "DAMAGED"]).optional()
    )

}).refine(
    (data) => !!data.productId !== !!data.partId,
    {
        message: "Selecciona el ítem (producto o pieza) a devolver.",
        path: ["productId"]
    }
);

export type ReturnFormData = z.input<typeof returnSchema>;
