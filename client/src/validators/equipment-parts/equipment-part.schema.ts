import { z } from "zod";

export const setEquipmentPartsSchema = z.object({

    parts: z.array(
        z.object({
            partId: z.string().min(1, "Seleccione una pieza."),
            quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero.")
        })
    )

});

export type SetEquipmentPartsFormData = z.input<typeof setEquipmentPartsSchema>;
