import { z } from "zod";

export const productSchema = z.object({

    internalCode: z.string().min(1, "Código obligatorio"),

    barcode: z.string().optional(),

    name: z.string().min(1, "Nombre obligatorio"),

    description: z.string().optional(),

    brand: z.string().min(1, "Ingrese una marca"),

    categoryId: z.string().min(1, "Seleccione una categoría"),

    unitOfMeasure: z.string().min(1, "Ingrese una unidad de medida"),

    marginProfileIds: z
        .array(z.string())
        .min(1, "Seleccione al menos un perfil de precio"),

    costPrice: z.coerce.number().min(0),

    minimumStock: z.coerce.number().min(0)

});

export type ProductFormData = z.input<typeof productSchema>;