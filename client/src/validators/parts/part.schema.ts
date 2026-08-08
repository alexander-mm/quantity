import { z } from "zod";

export const partSchema = z.object({
    code: z.string().trim().min(1, "El código es obligatorio.").max(50, "Máximo 50 caracteres."),
    name: z.string().trim().min(1, "El nombre es obligatorio.").max(150, "Máximo 150 caracteres."),
    description: z.string().trim().max(500, "Máximo 500 caracteres.").optional(),
    minimumStock: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    initialQuantity: z.coerce.number().min(0, "No puede ser negativo.").optional()
});

export type PartFormData = z.infer<typeof partSchema>;
