import { z } from "zod";

export const setEquipmentPartsSchema = z.object({

    parts: z.array(
        z.object({
            partId: z.string().min(1, "Seleccione una pieza."),
            quantity: z.number().positive("La cantidad debe ser mayor que cero.")
        })
    )

});

export type SetEquipmentPartsFormData = z.infer<typeof setEquipmentPartsSchema>;
