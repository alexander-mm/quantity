import { z } from "zod";

export const setPartComponentProductsSchema = z.object({

    products: z.array(
        z.object({
            componentProductId: z.string().min(1, "Seleccione un producto."),
            quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero.")
        })
    )

});

export type SetPartComponentProductsFormData = z.input<typeof setPartComponentProductsSchema>;