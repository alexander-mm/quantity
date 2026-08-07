import { z } from "zod";

export const partRecipeSchema = z.object({

    rawMaterialId: z.string().trim().min(1, "Seleccione la materia prima de origen."),
    rawMaterialShape: z.enum(["SHEET", "TUBE"]).optional(),
    pieceWidth: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    pieceHeight: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    pieceLength: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    piecesPerUnit: z.coerce.number({ error: "Este campo es obligatorio." }).positive("Debe ser mayor que cero.")

}).superRefine((data, ctx) => {

    if (data.rawMaterialShape === "SHEET") {

        if (data.pieceWidth === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El ancho de la pieza es obligatorio.", path: ["pieceWidth"] });
        }

        if (data.pieceHeight === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El alto de la pieza es obligatorio.", path: ["pieceHeight"] });
        }

    }

    if (data.rawMaterialShape === "TUBE" && data.pieceLength === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La longitud de la pieza es obligatoria.", path: ["pieceLength"] });
    }

});

export type PartRecipeFormData = z.input<typeof partRecipeSchema>;
