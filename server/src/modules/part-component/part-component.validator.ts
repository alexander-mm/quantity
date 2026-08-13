import { z } from "zod";

export const setPartComponentsSchema = z.object({

    components: z.array(
        z.object({
            componentPartId: z.string().trim().min(1, "Seleccione una pieza."),
            quantity: z.coerce.number().positive("La cantidad debe ser mayor que cero.")
        })
    )

});