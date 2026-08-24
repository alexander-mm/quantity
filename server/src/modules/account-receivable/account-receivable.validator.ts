import { z } from "zod";

export const updateAccountReceivableSchema = z.object({

    number: z
        .string()
        .trim()
        .min(1, "El número es obligatorio.")
        .max(50, "El número no puede superar los 50 caracteres."),

    observations: z
        .string()
        .trim()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional()

});

export const createAccountReceivablePaymentSchema = z.object({

    amount: z
        .coerce
        .number({ error: "El monto es obligatorio." })
        .positive("El monto debe ser mayor que cero."),

    paymentMethod: z
        .enum(["CASH", "TRANSFER"], { error: "Seleccione la forma de pago." }),

    paymentDate: z
        .coerce
        .date({ error: "Seleccione la fecha del abono." }),

    vouchers: z
        .array(z.string().trim().min(1, "Ingrese el número de comprobante."))
        .optional(),

    observations: z
        .string()
        .trim()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional()

}).superRefine((data, ctx) => {

    if (data.paymentMethod === "TRANSFER" && (!data.vouchers || data.vouchers.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debe indicar al menos un número de comprobante.",
            path: ["vouchers"]
        });
    }

});
