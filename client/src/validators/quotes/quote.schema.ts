import { z } from "zod";

const quoteDetailSchema = z.object({

    productId: z.string().min(1, "Selecciona el producto."),

    quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("Debe ser mayor que cero."),

    unitPrice: z.coerce.number({ error: "El precio es obligatorio." }).min(0, "No puede ser negativo."),

    discount: z.coerce.number().min(0).optional(),

    tax: z.coerce.number().min(0).optional()

});

export const quoteSchema = z.object({

    number: z.string().trim().min(1, "El número es obligatorio.").max(50, "Máximo 50 caracteres."),

    clientId: z.string().min(1, "Selecciona el cliente."),

    currency: z.enum(["USD", "COP"]),

    quoteDate: z.string().min(1, "La fecha es obligatoria."),

    validUntil: z.string().optional(),

    observations: z.string().trim().max(500, "Máximo 500 caracteres.").optional(),

    details: z.array(quoteDetailSchema).min(1, "Agrega al menos un producto.")

});

export type QuoteFormData = z.input<typeof quoteSchema>;
