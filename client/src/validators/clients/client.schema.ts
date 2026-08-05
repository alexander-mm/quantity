import { z } from "zod";

export const clientSchema = z.object({
    document: z.string().trim().min(1, "El documento es obligatorio.").max(50, "Máximo 50 caracteres."),
    firstName: z.string().trim().max(100, "Máximo 100 caracteres.").optional(),
    lastName: z.string().trim().max(100, "Máximo 100 caracteres.").optional(),
    companyName: z.string().trim().max(150, "Máximo 150 caracteres.").optional(),
    phone: z.string().trim().max(30, "Máximo 30 caracteres.").optional(),
    email: z.string().trim().email("Correo inválido.").max(150, "Máximo 150 caracteres.").optional().or(z.literal("")),
    address: z.string().trim().max(255, "Máximo 255 caracteres.").optional(),
    discountPercentage: z.coerce.number().min(0, "No puede ser negativo.").max(100, "No puede superar 100%.").optional(),
    isWholesaler: z.boolean().default(false),
    usesCredit: z.boolean().default(false),
    currency: z.enum(["USD", "COP"]).optional()
}).superRefine((data, ctx) => {

    if (data.isWholesaler && !data.currency) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Seleccione la moneda que maneja el mayorista.",
            path: ["currency"]
        });
    }

});

export type ClientFormData = z.input<typeof clientSchema>;
