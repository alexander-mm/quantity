import { z } from "zod";

const paymentMethodEntrySchema = z.object({
    method: z.enum(["CASH", "TRANSFER"]),
    amount: z.number().positive("El monto debe ser mayor que cero.")
});

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
        .enum(["CASH","TRANSFER","CREDIT","MIXED"],{error:"Seleccione la forma de pago."}),

    paymentMethods:z
        .array(paymentMethodEntrySchema)
        .optional(),

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

    downPaymentMethods:z
        .array(paymentMethodEntrySchema)
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

    if (data.paymentMethod !== "CREDIT") {

        if (!data.paymentMethods || data.paymentMethods.length === 0) {

            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Debe indicar al menos un método de pago.",
                path: ["paymentMethods"]
            });

        } else {

            const methods = data.paymentMethods.map(entry => entry.method);

            if (methods.includes("TRANSFER") && (!data.transferVouchers || data.transferVouchers.length === 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Debe indicar al menos un número de comprobante.",
                    path: ["transferVouchers"]
                });
            }

            const subtotal = data.details.reduce(
                (sum, item) => sum + (item.quantity * item.unitPrice), 0
            );
            const discount = data.details.reduce((sum, item) => sum + (item.discount ?? 0), 0);
            const tax = data.details.reduce((sum, item) => sum + (item.tax ?? 0), 0);
            const shippingCost = data.hasShipping ? (data.shippingCost ?? 0) : 0;
            const laborCost = data.hasLabor ? (data.laborCost ?? 0) : 0;
            const total = subtotal - discount + tax + shippingCost + laborCost;

            const sum = data.paymentMethods.reduce((s, entry) => s + entry.amount, 0);

            if (Math.abs(sum - total) > 0.01) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `La suma de los métodos de pago (${sum}) no coincide con el total de la venta (${total}).`,
                    path: ["paymentMethods"]
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

                const sum = data.downPaymentMethods.reduce((s, entry) => s + entry.amount, 0);

                if (Math.abs(sum - data.downPayment) > 0.01) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `La suma de los métodos de pago del abono (${sum}) no coincide con el monto del abono (${data.downPayment}).`,
                        path: ["downPaymentMethods"]
                    });
                }

            }

        }

    }

});

export type SaleFormData=
    z.infer<
        typeof saleSchema
    >;
