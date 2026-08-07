import { z } from "zod";

export const inventoryAdjustmentSchema = z.object({
    productId: z.string().min(1, "Seleccione un producto."),
    storeId: z.string().min(1, "Seleccione una bodega."),
    type: z.enum(["IN", "OUT"], { message: "Seleccione el tipo de ajuste." }),
    quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero."),
    reason: z.string().trim().min(1, "Indique el motivo del ajuste.").max(255)
});

export type InventoryAdjustmentFormData = z.infer<typeof inventoryAdjustmentSchema>;