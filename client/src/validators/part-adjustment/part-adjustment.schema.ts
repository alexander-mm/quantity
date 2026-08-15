import { z } from "zod";

export const partAdjustmentSchema = z.object({
    number: z.string().trim().min(1, "El número es obligatorio."),
    partId: z.string().min(1, "Seleccione una pieza."),
    type: z.enum(["IN", "OUT"], { message: "Seleccione el tipo de ajuste." }),
    quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero."),
    reason: z.string().trim().min(1, "Indique el motivo del ajuste.").max(255)
});

export type PartAdjustmentFormData = z.input<typeof partAdjustmentSchema>;
