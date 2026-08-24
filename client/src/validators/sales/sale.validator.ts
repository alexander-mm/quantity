import { z } from "zod";

export const saleSchema=z.object({

    // Consecutivo por tienda asignado por el servidor; de solo lectura en el formulario.
    number:z
        .string()
        .optional(),

    clientId:z
        .string()
        .min(1,"Seleccione un cliente."),

    storeId:z
        .string()
        .min(1,"Seleccione una bodega."),

    currency:z
        .enum(["USD","COP"]),

    saleDate:z
        .string()
        .min(1,"Seleccione la fecha."),

    reference:z
        .string()
        .optional(),

    observations:z
        .string()
        .optional(),

    hasShipping:z
        .boolean()
        .optional(),

    shippingCost:z
        .number()
        .min(0)
        .optional(),

    hasLabor:z
        .boolean()
        .optional(),

    laborCost:z
        .number()
        .min(0)
        .optional(),

    paymentMethod:z
        .enum(["CASH","TRANSFER","CREDIT"],{error:"Seleccione la forma de pago."}),

    transferVouchers:z
        .array(z.string().min(1,"Ingrese el número de comprobante."))
        .optional(),

    accountReceivableNumber:z
        .string()
        .optional(),

    downPayment:z
        .number()
        .min(0)
        .optional(),

    downPaymentMethod:z
        .enum(["CASH","TRANSFER"])
        .optional(),

    downPaymentVouchers:z
        .array(z.string().min(1,"Ingrese el número de comprobante."))
        .optional(),

    termDays:z
        .number()
        .int()
        .positive()
        .optional(),

    // No se persiste: solo controla qué precio (PVP USD N / PVP COP N) se aplica a las líneas de la venta.
    priceEntryKey:z
        .string()
        .optional(),

    // No se persiste: solo controla el % de descuento que se reparte entre las líneas cuando el
    // cliente no tiene un porcentaje de descuento asignado.
    totalDiscountPercentage:z
        .number()
        .min(0)
        .optional(),

    details:z
        .array(

            z.object({

                productId:z
                    .string()
                    .min(1,"Seleccione un producto."),

                quantity:z
                    .number({error:"La cantidad es obligatoria."})
                    .positive("La cantidad debe ser mayor que cero."),

                unitPrice:z
                    .number({error:"El precio unitario es obligatorio."})
                    .min(0),

                discount:z
                    .number()
                    .min(0)
                    .optional(),

                tax:z
                    .number()
                    .min(0)
                    .optional()

            })

        )
        .min(
            1,
            "Debe agregar al menos un producto."
        )

}).superRefine((data, ctx) => {

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

    if (data.paymentMethod === "TRANSFER" && (!data.transferVouchers || data.transferVouchers.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debe indicar al menos un número de comprobante.",
            path: ["transferVouchers"]
        });
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

export type SaleFormData=
    z.infer<
        typeof saleSchema
    >;
