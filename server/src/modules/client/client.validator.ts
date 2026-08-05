import { z } from "zod";

export const createClientSchema = z.object({

    document: z
        .string()
        .trim()
        .min(1, "El documento es obligatorio.")
        .max(50, "El documento no puede superar los 50 caracteres."),

    firstName: z
        .string()
        .trim()
        .max(100, "El nombre no puede superar los 100 caracteres.")
        .optional(),

    lastName: z
        .string()
        .trim()
        .max(100, "El apellido no puede superar los 100 caracteres.")
        .optional(),

    companyName: z
        .string()
        .trim()
        .max(150, "La empresa no puede superar los 150 caracteres.")
        .optional(),

    phone: z
        .string()
        .trim()
        .max(30, "El teléfono no puede superar los 30 caracteres.")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Correo electrónico inválido.")
        .max(150, "El correo no puede superar los 150 caracteres.")
        .optional(),

    address: z
        .string()
        .trim()
        .max(255, "La dirección no puede superar los 255 caracteres.")
        .optional(),

    discountPercentage: z
        .number()
        .min(0, "El descuento no puede ser negativo.")
        .max(100, "El descuento no puede superar el 100%.")
        .optional(),

    isWholesaler: z
        .boolean()
        .optional()
        .default(false),

    usesCredit: z
        .boolean()
        .optional()
        .default(false),

    currency: z
        .enum(["USD", "COP"])
        .optional()

}).superRefine((data, ctx) => {

    if (!data.isWholesaler) {

        if (data.usesCredit) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El crédito solo aplica a clientes mayoristas.",
                path: ["usesCredit"]
            });
        }

        if (data.discountPercentage) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El % de descuento propio solo aplica a clientes mayoristas.",
                path: ["discountPercentage"]
            });
        }

        return;

    }

    if (!data.currency) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Seleccione la moneda que maneja el mayorista.",
            path: ["currency"]
        });
    }

});

export const updateClientSchema = createClientSchema;
