import { z } from "zod";

export const productSchema = z.object({

    internalCode: z.string().min(1, "Código obligatorio"),

    barcode: z.string().optional(),

    name: z.string().min(1, "Nombre obligatorio"),

    description: z.string().optional(),

    brandId: z.string().min(1, "Seleccione una marca"),

    categoryId: z.string().min(1, "Seleccione una categoría"),

    unitOfMeasureId: z.string().min(1, "Seleccione una unidad"),

    marginProfileId: z.string().min(1, "Seleccione un perfil"),

    costPrice: z.coerce.number().min(0),

    minimumStock: z.coerce.number().min(0)

});

export type ProductFormData = z.input<typeof productSchema>;