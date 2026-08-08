import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
    description: z.string().trim().optional(),
    stockMultiplier: z.coerce.number().positive("El multiplicador debe ser mayor que cero.").optional()
});

export type CategoryFormData = z.infer<typeof categorySchema>;
