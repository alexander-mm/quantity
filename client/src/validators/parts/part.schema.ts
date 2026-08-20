import { z } from "zod";

export const partSchema = z.object({
    code: z.string().trim().min(1, "El código es obligatorio.").max(50, "Máximo 50 caracteres."),
    name: z.string().trim().min(1, "El nombre es obligatorio.").max(150, "Máximo 150 caracteres."),
    description: z.string().trim().max(500, "Máximo 500 caracteres.").optional(),
    categoryId: z.string().trim().min(1, "Seleccione una categoría.").optional(),
    minimumStock: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    cost: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    initialQuantity: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    components: z.array(z.object({
        type: z.enum(["PART", "PRODUCT"]),
        refId: z.string().min(1, "Seleccione un elemento."),
        quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero.")
    })).optional(),

    // Receta de corte (opcional): de qué materia prima se corta esta pieza y el costeo
    // asociado. Todo se administra desde acá — ya no existe un formulario aparte.
    rawMaterialId: z.string().trim().optional(),
    pieceWidth: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    pieceHeight: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    pieceLength: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    piecesPerUnit: z.coerce.number().positive("Debe ser mayor que cero.").optional(),
    laserMeters: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    usesMechanicalCut: z.coerce.boolean().optional(),
    bendCount: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    curveCount: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    weldingCost: z.coerce.number().min(0, "No puede ser negativo.").optional(),
    otherCostDescription: z.string().trim().max(150, "Máximo 150 caracteres.").optional(),
    otherCostAmount: z.coerce.number().min(0, "No puede ser negativo.").optional()
});

export type PartFormData = z.input<typeof partSchema>;