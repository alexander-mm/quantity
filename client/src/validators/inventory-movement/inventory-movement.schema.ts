import { z } from "zod";

export const inventoryMovementSchema = z.object({
    movementTypeId: z.string().min(1,"Seleccione un tipo de movimiento."),
    productId: z.string().min(1,"Seleccione un producto."),
    storeId: z.string().min(1,"Seleccione una bodega."),
    quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero."),
    unitCost: z.coerce.number({ error: "El costo es obligatorio." }).min(0,"El costo no puede ser negativo."),
    observations: z.string().max(255).optional().default("")
});

export type InventoryMovementFormData=z.infer<typeof inventoryMovementSchema>;