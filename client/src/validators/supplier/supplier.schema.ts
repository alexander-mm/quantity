import { z } from "zod";

export const supplierSchema = z.object({

    code: z.string().min(1, "Código obligatorio"),

    companyName: z.string().min(1, "Razón social obligatoria"),

    contactName: z.string().optional(),

    taxId: z.string().optional(),

    phone: z.string().optional(),

    email: z
        .string()
        .email("Correo electrónico inválido")
        .optional()
        .or(z.literal("")),

    address: z.string().optional(),

    city: z.string().optional(),

    observations: z.string().optional()

});

export type SupplierFormData =
    z.input<typeof supplierSchema>;