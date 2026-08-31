import { z } from "zod";

const quoteDetailSchema = z.object({

    productId: z.string().min(1, "El producto es obligatorio."),

    quantity: z.coerce.number().positive("La cantidad debe ser mayor que cero."),

    unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),

    discount: z.coerce.number().min(0).optional(),

    tax: z.coerce.number().min(0).optional()

});

const baseQuoteSchema = z.object({

    number: z
        .string()
        .trim()
        .min(1, "El número es obligatorio.")
        .max(50, "El número no puede superar los 50 caracteres."),

    clientId: z.string().min(1, "El cliente es obligatorio."),

    currency: z.enum(["USD", "COP"]),

    quoteDate: z.coerce.date(),

    validUntil: z.coerce.date().optional(),

    observations: z
        .string()
        .trim()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional(),

    details: z.array(quoteDetailSchema).min(1, "Agrega al menos un producto."),

    hasShipping: z.boolean().optional(),
    shippingCost: z.coerce.number().min(0).optional(),

    hasAdditionalCost: z.boolean().optional(),
    additionalCost: z.coerce.number().min(0).optional()

});

function applyCostRules<
    T extends z.ZodType<{
        hasShipping?: boolean;
        shippingCost?: number;
        hasAdditionalCost?: boolean;
        additionalCost?: number;
    }>
>(
    schema: T
) {

    return schema.superRefine((data, ctx) => {

        if (data.hasShipping && !(data.shippingCost && data.shippingCost > 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Indique el costo de envío.",
                path: ["shippingCost"]
            });
        }

        if (data.hasAdditionalCost && !(data.additionalCost && data.additionalCost > 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Indique el costo adicional.",
                path: ["additionalCost"]
            });
        }

    });

}

export const createQuoteSchema = applyCostRules(baseQuoteSchema);

export const updateQuoteSchema = createQuoteSchema;

export const convertQuoteSchema = z.object({

    saleId: z.string().min(1, "La venta es obligatoria.")

});
