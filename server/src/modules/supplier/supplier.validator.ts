import { z } from "zod";

export const createSupplierSchema=z.object({
    code:z.string().trim().min(1).max(20),
    companyName:z.string().trim().min(1).max(150),
    contactName:z.string().trim().max(150).optional(),
    taxId:z.string().trim().max(20).optional(),
    phone:z.string().trim().max(20).optional(),
    email:z.string().trim().email().max(150).optional().or(z.literal("")),
    address:z.string().trim().max(250).optional(),
    city:z.string().trim().max(100).optional(),
    observations:z.string().trim().max(500).optional()
});

export const updateSupplierSchema=createSupplierSchema;