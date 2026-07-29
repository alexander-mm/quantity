import { z } from "zod";

export const unitOfMeasureSchema = z.object({
    code: z.string().trim().min(1, "El código es obligatorio.").max(20, "Máximo 20 caracteres."),
    name: z.string().trim().min(1, "El nombre es obligatorio."),
    description: z.string().trim().optional()
});

export type UnitOfMeasureFormData = z.infer<typeof unitOfMeasureSchema>;
