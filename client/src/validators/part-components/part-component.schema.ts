import { z } from "zod";

export const setPartComponentsSchema = z.object({

    components: z.array(
        z.object({
            componentPartId: z.string().min(1, "Seleccione una pieza."),
            quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero.")
        })
    )

});

export type SetPartComponentsFormData = z.input<typeof setPartComponentsSchema>;