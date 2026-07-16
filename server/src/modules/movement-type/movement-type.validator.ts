import { StockOperation } from "@prisma/client";
import { z } from "zod";

export const createMovementTypeSchema = z.object({

    code: z
        .string()
        .trim()
        .min(1, "El código es obligatorio.")
        .max(20, "El código no puede superar los 20 caracteres."),

    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(100, "El nombre no puede superar los 100 caracteres."),

    description: z
        .string()
        .trim()
        .max(255, "La descripción no puede superar los 255 caracteres.")
        .optional(),

    affectsStock: z.boolean({

        message: "Debe indicar si afecta el inventario."

    }),

    stockOperation: z.nativeEnum(StockOperation, {

        message: "La operación del inventario es obligatoria."

    })

});