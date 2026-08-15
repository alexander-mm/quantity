import { z } from "zod";

export const rawMaterialAdjustmentSchema = z.object({
    number: z.string().trim().min(1, "El número es obligatorio."),
    rawMaterialId: z.string().min(1, "Seleccione una materia prima."),
    type: z.enum(["IN", "OUT"], { message: "Seleccione el tipo de ajuste." }),
    quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero."),
    reason: z.string().trim().min(1, "Indique el motivo del ajuste.").max(255)
});

export type RawMaterialAdjustmentFormData = z.input<typeof rawMaterialAdjustmentSchema>;
