import { z } from "zod";

export const partSchema = z.object({
    code: z.string().trim().min(1, "El código es obligatorio.").max(50, "Máximo 50 caracteres."),
    name: z.string().trim().min(1, "El nombre es obligatorio.").max(150, "Máximo 150 caracteres."),
    description: z.string().trim().max(500, "Máximo 500 caracteres.").optional(),
    categoryId: z.string().trim().min(1, "Seleccione una categoría.").optional(),
    minimumStock: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    cost: z.coerce.number({ error: "El costo es obligatorio." }).min(0, "No puede ser negativo."),
    initialQuantity: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    components: z.array(z.object({
        type: z.enum(["PART", "PRODUCT"]),
        refId: z.string().min(1, "Seleccione un elemento."),
        quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero.")
    })).optional()
});

export type PartFormData = z.input<typeof partSchema>;