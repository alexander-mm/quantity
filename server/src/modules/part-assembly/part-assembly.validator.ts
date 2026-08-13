import { z } from "zod";

export const createPartAssemblySchema = z.object({

    number: z
        .string()
        .trim()
        .min(1, "El número es obligatorio.")
        .max(50, "El número no puede superar los 50 caracteres."),

    partId: z
        .string()
        .trim()
        .min(1, "Seleccione la pieza a ensamblar."),

    quantity: z
        .coerce
        .number()
        .positive("La cantidad debe ser mayor que cero."),

    observations: z
        .string()
        .trim()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional()

});

export const updatePartAssemblySchema = createPartAssemblySchema;