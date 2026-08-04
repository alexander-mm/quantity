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

    pvp: z.coerce.number().positive("El PVP debe ser mayor que cero."),

    pvpCop: z.coerce.number().min(0, "El PVP en COP no puede ser negativo.").optional(),

    minimumStock: z.coerce.number().min(0),

    components: z.array(z.object({
        componentProductId: z.string().min(1, "Seleccione un producto."),
        quantity: z.coerce.number().positive("La cantidad debe ser mayor que cero.")
    })).optional()

});

export type ProductFormData = z.input<typeof productSchema>;