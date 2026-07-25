import { z } from "zod";

export const createSaleSchema=z.object({
    number:z.string().trim().min(1).max(50),
    clientId:z.string().trim().min(1),
    storeId:z.string().trim().min(1),
    userId:z.string().trim().min(1),
    saleDate:z.coerce.date(),
    reference:z.string().trim().max(100).optional(),
    observations:z.string().trim().max(500).optional(),
    details:z.array(z.object({
        productId:z.string().trim().min(1),
        quantity:z.coerce.number().positive(),
        unitPrice:z.coerce.number().min(0),
        discount:z.coerce.number().min(0).optional().default(0),
        tax:z.coerce.number().min(0).optional().default(0)
    })).min(1,"Debe agregar al menos un producto.")
});

export const updateSaleSchema=createSaleSchema.extend({
    status:z.enum([
        "DRAFT",
        "CONFIRMED",
        "CANCELLED"
    ])
});
