import { z } from "zod";

export const productSchema = z.object({

    internalCode: z.string().min(1, "Código obligatorio"),

    barcode: z.string().optional(),

    name: z.string().min(1, "Nombre obligatorio"),

    description: z.string().optional(),

    brand: z.string().min(1, "Ingrese una marca"),

    categoryId: z.string().min(1, "Seleccione una categoría"),

    unitOfMeasure: z.string().min(1, "Ingrese una unidad de medida"),

    baseCostPrice: z.coerce.number({ error: "El costo es obligatorio." }).min(0),

    additionalCosts: z.array(z.object({
        description: z.string().trim().min(1, "Ingrese una descripción."),
        amount: z.coerce.number({ error: "El monto es obligatorio." }).min(0, "El monto no puede ser negativo.")
    })).optional(),

    pvp: z.coerce.number({ error: "El PVP es obligatorio." }).positive("El PVP debe ser mayor que cero."),

    pvpCop: z.coerce.number().min(0, "El PVP en COP no puede ser negativo.").optional(),

    minimumStock: z
        .number({ error: "El stock mínimo es obligatorio." })
        .min(0, "El stock mínimo no puede ser negativo."),

    assembleOnSale: z.boolean().optional(),

    components: z.array(z.object({
        type: z.enum(["PRODUCT", "PART"]),
        refId: z.string().min(1, "Seleccione un elemento."),
        quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero.")
    })).optional(),

    priceEntries: z.array(z.object({
        currency: z.enum(["USD", "COP"]),
        price: z.coerce.number({ error: "El precio es obligatorio." }).positive("Debe ser mayor que cero.")
    })).optional()

});

export type ProductFormData = z.input<typeof productSchema>;