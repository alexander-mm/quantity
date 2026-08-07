import { z } from "zod";

export const partCuttingOrderSchema = z.object({
    number: z.string().min(1, "Ingrese el número."),
    partId: z.string().min(1, "Seleccione la pieza a cortar."),
    rawMaterialQtyUsed: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero."),
    observations: z.string().optional()
});

export type PartCuttingOrderFormData = z.input<typeof partCuttingOrderSchema>;

export const confirmPartCuttingOrderSchema = z.object({
    goodPieces: z.coerce.number({ error: "Indique la cantidad de piezas buenas." }).min(0, "No puede ser negativo."),
    defectivePieces: z.coerce.number().min(0, "No puede ser negativo.").optional()
}).refine(
    data => data.goodPieces > 0 || (data.defectivePieces ?? 0) > 0,
    { message: "Debe registrar al menos una pieza buena o dañada.", path: ["goodPieces"] }
);

export type ConfirmPartCuttingOrderFormData = z.input<typeof confirmPartCuttingOrderSchema>;
