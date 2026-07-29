import { z } from "zod";

export const brandSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
    description: z.string().trim().optional()
});
export type BrandFormData = z.infer<typeof brandSchema>;