import { z } from "zod";

export const rawMaterialMovementSchema = z.object({

    number: z.string().min(1, "Ingrese el número."),

    type: z.enum(["IN", "OUT"]),

    movementDate: z.string().min(1, "Seleccione la fecha."),

    observations: z.string().optional(),

    details: z.array(

        z.object({
            rawMaterialId: z.string().min(1, "Seleccione una materia prima."),
            quantity: z.number().positive("La cantidad debe ser mayor que cero.")
        })

    ).min(1, "Debe agregar al menos una materia prima.")

});

export type RawMaterialMovementFormData = z.infer<typeof rawMaterialMovementSchema>;
