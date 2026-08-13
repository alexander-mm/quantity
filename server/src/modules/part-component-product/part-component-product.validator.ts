import { z } from "zod";

export const setPartComponentProductsSchema = z.object({

    products: z.array(
        z.object({
            componentProductId: z.string().trim().min(1, "Seleccione un producto."),
            quantity: z.coerce.number().positive("La cantidad debe ser mayor que cero.")
        })
    )

});