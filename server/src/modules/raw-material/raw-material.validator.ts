import { z } from "zod";

const baseRawMaterialSchema = z.object({

    code: z
        .string()
        .trim()
        .min(1, "El código es obligatorio.")
        .max(50, "El código no puede superar los 50 caracteres."),

    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(150, "El nombre no puede superar los 150 caracteres."),

    shape: z.enum(["SHEET", "TUBE", "ROD"]),

    material: z
        .string()
        .trim()
        .min(1, "El material es obligatorio.")
        .max(100, "El material no puede superar los 100 caracteres."),

    thickness: z
        .coerce
        .number()
        .positive("El calibre/espesor debe ser mayor que cero."),

    width: z
        .coerce
        .number()
        .positive("El ancho/diámetro debe ser mayor que cero.")
        .optional(),

    height: z
        .coerce
        .number()
        .positive("El alto debe ser mayor que cero.")
        .optional(),

    length: z
        .coerce
        .number()
        .positive("La longitud debe ser mayor que cero.")
        .optional(),

    minimumStock: z
        .coerce
        .number()
        .min(0, "El stock mínimo no puede ser negativo.")
        .optional(),

    profile: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.enum(["ROUND", "SQUARE", "RECTANGULAR"]).optional()
    )

});

function applyShapeRules<T extends z.ZodType<{
    shape: "SHEET" | "TUBE" | "ROD";
    width?: number;
    height?: number;
    length?: number;
    profile?: "ROUND" | "SQUARE" | "RECTANGULAR" | undefined;
}>>(schema: T) {

    return schema.superRefine((data, ctx) => {

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

}

export const createRawMaterialSchema = applyShapeRules(baseRawMaterialSchema.extend({

    initialQuantity: z
        .coerce
        .number()
        .min(0, "No puede ser negativo.")
        .optional()

}));

export const updateRawMaterialSchema = applyShapeRules(baseRawMaterialSchema);
