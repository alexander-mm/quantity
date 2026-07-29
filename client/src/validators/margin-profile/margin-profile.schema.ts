import { z } from "zod";

export const marginProfileSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio."),
    percentage: z.coerce.number().min(0, "No puede ser negativo.").max(1000, "Máximo 1000."),
    displayOrder: z.coerce.number().int("Debe ser un número entero.").min(1, "Debe ser mayor que cero.")
});

export type MarginProfileFormData = z.infer<typeof marginProfileSchema>;
