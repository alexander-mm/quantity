import { z } from "zod";

const paymentMethodEntrySchema = z.object({
    method: z.enum(["CASH", "TRANSFER"]),
    amount: z.coerce.number().positive()
});

const baseSaleSchema=z.object({
    clientUuid:z.string().trim().uuid().optional(),
    // Consecutivo por tienda: lo asigna el servidor, nunca lo envía el cliente.
    number:z.string().trim().max(50).optional(),
    clientId:z.string().trim().min(1),
    storeId:z.string().trim().min(1),
    userId:z.string().trim().min(1),
    currency:z.enum(["USD","COP"]).default("USD"),
    saleDate:z.coerce.date(),
    reference:z.string().trim().max(100).optional(),
    observations:z.string().trim().max(500).optional(),
    details:z.array(z.object({
        productId:z.string().trim().min(1),
        quantity:z.coerce.number().positive(),
        unitPrice:z.coerce.number().min(0),
        discount:z.coerce.number().min(0).optional().default(0),
        tax:z.coerce.number().min(0).optional().default(0)
    })).min(1,"Debe agregar al menos un producto."),

    hasShipping:z.boolean().optional(),
    shippingCost:z.coerce.number().min(0).optional(),

    hasLabor:z.boolean().optional(),
    laborCost:z.coerce.number().min(0).optional(),

    paymentMethod:z.enum(["CASH","TRANSFER","CREDIT","MIXED"]).optional(),
    paymentMethods:z.array(paymentMethodEntrySchema).optional(),

    transferVouchers:z.array(z.string().trim().min(1)).optional(),

    accountReceivableNumber:z.string().trim().max(50).optional(),
    downPayment:z.coerce.number().min(0).optional(),
    downPaymentMethods:z.array(paymentMethodEntrySchema).optional(),
    downPaymentVouchers:z.array(z.string().trim().min(1)).optional(),
    termDays:z.coerce.number().int().positive().optional()
});

function applyPaymentMethodRules<
    T extends z.ZodType<{
        paymentMethod?: "CASH" | "TRANSFER" | "CREDIT" | "MIXED";
        paymentMethods?: { method: "CASH" | "TRANSFER"; amount: number }[];
        transferVouchers?: string[];
        accountReceivableNumber?: string;
        downPayment?: number;
        downPaymentMethods?: { method: "CASH" | "TRANSFER"; amount: number }[];
        downPaymentVouchers?: string[];
        hasShipping?: boolean;
        shippingCost?: number;
        hasLabor?: boolean;
        laborCost?: number;
    }>
>(
    schema: T
) {

    return schema.superRefine((data, ctx) => {

        if (data.hasShipping && !(data.shippingCost && data.shippingCost > 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Indique el costo de envío.",
                path: ["shippingCost"]
            });
        }

        if (data.hasLabor && !(data.laborCost && data.laborCost > 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Indique el costo de mano de obra.",
                path: ["laborCost"]
            });
        }

        if (!data.paymentMethod) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Seleccione la forma de pago.",
                path: ["paymentMethod"]
            });
            return;
        }

        if (data.paymentMethod !== "CREDIT") {

            if (!data.paymentMethods || data.paymentMethods.length === 0) {

                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Debe indicar al menos un método de pago.",
                    path: ["paymentMethods"]
                });

            } else {

                const methods = data.paymentMethods.map(entry => entry.method);

                if (new Set(methods).size !== methods.length) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "No puede repetir el mismo método de pago.",
                        path: ["paymentMethods"]
                    });
                }

                if (data.paymentMethod === "MIXED" && data.paymentMethods.length < 2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Para pago mixto debe indicar al menos dos métodos de pago.",
                        path: ["paymentMethods"]
                    });
                }

                if (
                    data.paymentMethod !== "MIXED" &&
                    (data.paymentMethods.length !== 1 || data.paymentMethods[0].method !== data.paymentMethod)
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Los métodos de pago no coinciden con la forma de pago seleccionada.",
                        path: ["paymentMethods"]
                    });
                }

                if (methods.includes("TRANSFER") && (!data.transferVouchers || data.transferVouchers.length === 0)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Debe indicar al menos un número de comprobante.",
                        path: ["transferVouchers"]
                    });
                }

            }

        }

        if (data.paymentMethod === "CREDIT") {

            if (!data.accountReceivableNumber) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Debe indicar el número de cuenta de cobro.",
                    path: ["accountReceivableNumber"]
                });
            }

            if (data.downPayment && data.downPayment > 0) {

                if (!data.downPaymentMethods || data.downPaymentMethods.length === 0) {

                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Indique cómo se pagó el abono.",
                        path: ["downPaymentMethods"]
                    });

                } else {

                    const downPaymentMethodsList = data.downPaymentMethods.map(entry => entry.method);

                    if (new Set(downPaymentMethodsList).size !== downPaymentMethodsList.length) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "No puede repetir el mismo método de pago del abono.",
                            path: ["downPaymentMethods"]
                        });
                    }

                    if (
                        downPaymentMethodsList.includes("TRANSFER") &&
                        (!data.downPaymentVouchers || data.downPaymentVouchers.length === 0)
                    ) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Debe indicar al menos un número de comprobante del abono.",
                            path: ["downPaymentVouchers"]
                        });
                    }

                }

            }

        }

    });

}

export const createSaleSchema=applyPaymentMethodRules(baseSaleSchema);

export const updateSaleSchema=applyPaymentMethodRules(baseSaleSchema.extend({
    status:z.enum([
        "DRAFT",
        "CONFIRMED",
        "CANCELLED"
    ])
}));
