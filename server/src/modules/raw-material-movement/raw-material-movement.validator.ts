import { z } from "zod";

export const createRawMaterialMovementSchema = z.object({

    number: z
        .string()
        .trim()
        .min(1, "El número es obligatorio.")
        .max(50, "El número no puede superar los 50 caracteres."),

    type: z.enum(["IN", "OUT"]),

    movementDate: z.coerce.date(),

    observations: z
        .string()
        .trim()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional(),

    details: z.array(
        z.object({
            rawMaterialId: z.string().trim().min(1, "Seleccione una materia prima."),
            quantity: z.coerce.number().positive("La cantidad debe ser mayor que cero.")
        })
    ).min(1, "Debe agregar al menos una materia prima.")

});
