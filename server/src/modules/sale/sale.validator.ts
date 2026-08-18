import { z } from "zod";

const baseSaleSchema=z.object({
    clientUuid:z.string().trim().uuid().optional(),
    number:z.string().trim().min(1).max(50),
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

    paymentMethod:z.enum(["CASH","TRANSFER","CREDIT"]).optional(),

    transferVouchers:z.array(z.string().trim().min(1)).optional(),

    accountReceivableNumber:z.string().trim().max(50).optional(),
    downPayment:z.coerce.number().min(0).optional(),
    downPaymentMethod:z.enum(["CASH","TRANSFER"]).optional(),
    downPaymentVouchers:z.array(z.string().trim().min(1)).optional(),
    termDays:z.coerce.number().int().positive().optional()
});

function applyPaymentMethodRules(
    schema: typeof baseSaleSchema
) {

    return schema.superRefine((data, ctx) => {

        if (!data.paymentMethod) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Seleccione la forma de pago.",
                path: ["paymentMethod"]
            });
            return;
        }

        if (data.paymentMethod === "TRANSFER") {

            if (!data.transferVouchers || data.transferVouchers.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Debe indicar al menos un número de comprobante.",
                    path: ["transferVouchers"]
                });
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

                if (!data.downPaymentMethod) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Indique cómo se pagó el abono.",
                        path: ["downPaymentMethod"]
                    });
                }

                if (
                    data.downPaymentMethod === "TRANSFER" &&
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

    });

}

export const createSaleSchema=applyPaymentMethodRules(baseSaleSchema);

export const updateSaleSchema=baseSaleSchema.extend({
    status:z.enum([
        "DRAFT",
        "CONFIRMED",
        "CANCELLED"
    ])
});
