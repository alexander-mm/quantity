import { z } from "zod";

export const partRecipeSchema = z.object({

    rawMaterialId: z.string().trim().min(1, "Seleccione la materia prima de origen."),
    rawMaterialShape: z.enum(["SHEET", "TUBE", "ROD"]).optional(),
    // Ancho/alto/longitud son solo referencia (no alimentan ningún cálculo) — opcionales.
    pieceWidth: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    pieceHeight: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    pieceLength: z.coerce.number().positive("Debe ser mayor que cero.").optional()
    // piecesPerUnit se carga desde la ficha de la Pieza, este formulario no lo administra.

});

export type PartRecipeFormData = z.input<typeof partRecipeSchema>;
