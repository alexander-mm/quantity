import { z } from "zod";

export const productAssemblySchema = z.object({
    number: z.string().min(1, "Ingrese el número."),
    productId: z.string().min(1, "Seleccione el producto a ensamblar."),
    quantity: z.coerce.number().positive("La cantidad debe ser mayor que cero."),
    observations: z.string().optional()
});

export type ProductAssemblyFormData = z.input<typeof productAssemblySchema>;
