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

const paymentMethodEntrySchema = z.object({
    method: z.enum(["CASH", "TRANSFER"]),
    amount: z.coerce.number().positive()
});

export const createAccountReceivablePaymentSchema = z.object({

    amount: z
        .coerce
        .number({ error: "El monto es obligatorio." })
        .positive("El monto debe ser mayor que cero."),

    paymentMethods: z
        .array(paymentMethodEntrySchema)
        .min(1, "Seleccione al menos un método de pago."),

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

    const methods = data.paymentMethods.map(entry => entry.method);

    if (new Set(methods).size !== methods.length) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "No puede repetir el mismo método de pago.",
            path: ["paymentMethods"]
        });
    }

    const sum = data.paymentMethods.reduce((total, entry) => total + entry.amount, 0);

    if (Math.abs(sum - data.amount) > 0.01) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `La suma de los métodos de pago (${sum}) no coincide con el monto del abono (${data.amount}).`,
            path: ["paymentMethods"]
        });
    }

    if (methods.includes("TRANSFER") && (!data.vouchers || data.vouchers.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debe indicar al menos un número de comprobante.",
            path: ["vouchers"]
        });
    }

});
