import { z } from "zod";

export const createPurchaseSchema=z.object({
    number:z.string().trim().min(1).max(50),
    supplierId:z.string().trim().min(1),
    storeId:z.string().trim().min(1),
    userId:z.string().trim().min(1),
    purchaseDate:z.coerce.date(),
    reference:z.string().trim().max(100).optional(),
    observations:z.string().trim().max(500).optional(),
    details:z.array(z.object({
        productId:z.string().trim().min(1),
        quantity:z.coerce.number().positive(),
        unitCost:z.coerce.number().min(0),
        pvp:z.coerce.number().positive("El PVP debe ser mayor que cero."),
        discount:z.coerce.number().min(0).optional().default(0),
        tax:z.coerce.number().min(0).optional().default(0)
    })).min(1,"Debe agregar al menos un producto.")
});

export const updatePurchaseSchema=createPurchaseSchema.extend({
    status:z.enum([
        "DRAFT",
        "CONFIRMED",
        "CANCELLED"
    ])
});