import { z } from "zod";

export const setPartRecipeSchema = z.object({

    rawMaterialId: z
        .string()
        .trim()
        .min(1, "Seleccione la materia prima de origen."),

    pieceWidth: z
        .coerce
        .number()
        .positive("El ancho de la pieza debe ser mayor que cero.")
        .optional(),

    pieceHeight: z
        .coerce
        .number()
        .positive("El alto de la pieza debe ser mayor que cero.")
        .optional(),

    pieceLength: z
        .coerce
        .number()
        .positive("La longitud de la pieza debe ser mayor que cero.")
        .optional(),

    piecesPerUnit: z
        .coerce
        .number()
        .positive("Las piezas por unidad deben ser mayor que cero.")
        .optional(),

    // Costeo de producción: todos opcionales, se activan con un check en el formulario.
    laserMeters: z
        .coerce
        .number()
        .min(0, "Los metros de corte láser no pueden ser negativos.")
        .optional(),

    usesMechanicalCut: z
        .coerce
        .boolean()
        .optional(),

    bendCount: z
        .coerce
        .number()
        .min(0, "El número de dobleces no puede ser negativo.")
        .optional(),

    curveCount: z
        .coerce
        .number()
        .min(0, "El número de curvas no puede ser negativo.")
        .optional()

});
