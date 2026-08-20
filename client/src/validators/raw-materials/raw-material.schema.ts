import { z } from "zod";

export const rawMaterialSchema = z.object({

    code: z.string().trim().min(1, "El código es obligatorio.").max(50, "Máximo 50 caracteres."),
    name: z.string().trim().min(1, "El nombre es obligatorio.").max(150, "Máximo 150 caracteres."),
    shape: z.enum(["SHEET", "TUBE", "ROD"]),
    material: z.string().trim().min(1, "El material es obligatorio.").max(100, "Máximo 100 caracteres."),
    thickness: z.coerce.number({ error: "El calibre/espesor es obligatorio." }).positive("El calibre/espesor debe ser mayor que cero."),
    width: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    height: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    length: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    profile: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.enum(["ROUND", "SQUARE", "RECTANGULAR"]).optional()
    ),
    minimumStock: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    initialQuantity: z.coerce.number().min(0, "No puede ser negativo.").optional(),

    // Costeo de producción: todos opcionales.
    cost: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    wastePercentage: z.coerce.number().min(0, "No puede ser negativo.").max(100, "No puede superar 100.").optional(),
    laserCostPerMeter: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    mechanicalCutCost: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    bendCostPerBend: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    curveCostPerCurve: z.coerce.number().min(0, "No puede ser negativo.").optional()

}).superRefine((data, ctx) => {

    if (data.shape === "SHEET") {

        if (data.width === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El ancho de la lámina es obligatorio.", path: ["width"] });
        }

        if (data.height === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El alto de la lámina es obligatorio.", path: ["height"] });
        }

    }

    if (data.shape === "TUBE") {

        if (data.length === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La longitud del tubo es obligatoria.", path: ["length"] });
        }

        if (data.width === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El diámetro/lado del tubo es obligatorio.", path: ["width"] });
        }

        if (data.profile === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El perfil del tubo es obligatorio.", path: ["profile"] });
        }

        if (data.profile === "RECTANGULAR" && data.height === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El segundo lado es obligatorio para perfil rectangular.", path: ["height"] });
        }

    }

    if (data.shape === "ROD") {

        if (data.length === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La longitud de la varilla es obligatoria.", path: ["length"] });
        }

    }

});

export type RawMaterialFormData = z.input<typeof rawMaterialSchema>;
