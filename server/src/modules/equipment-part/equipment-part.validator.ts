import { z } from "zod";

export const setEquipmentPartsSchema = z.object({

    parts: z.array(
        z.object({
            partId: z.string().trim().min(1, "Seleccione una pieza."),
            quantity: z.coerce.number().positive("La cantidad debe ser mayor que cero.")
        })
    )

});
