import { z } from "zod";

export const partMovementSchema = z.object({

    number: z.string().min(1, "Ingrese el número."),

    type: z.enum(["IN", "OUT"]),

    movementDate: z.string().min(1, "Seleccione la fecha."),

    observations: z.string().optional(),

    details: z.array(

        z.object({
            partId: z.string().min(1, "Seleccione una pieza."),
            quantity: z.number().positive("La cantidad debe ser mayor que cero.")
        })

    ).min(1, "Debe agregar al menos una pieza.")

});

export type PartMovementFormData = z.infer<typeof partMovementSchema>;
