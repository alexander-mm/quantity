import { z } from "zod";

export const stockTransferSchema = z.object({

    number: z.string().trim().min(1, "El número es obligatorio."),

    originStoreId: z.string().min(1, "Seleccione el origen."),

    destType: z.enum(["STORE", "TECHNICIAN"]),

    destStoreId: z.string().optional(),

    destUserId: z.string().optional(),

    dispatchDate: z.string().min(1, "Seleccione la fecha."),

    observations: z.string().optional(),

    details: z.array(
        z.object({
            productId: z.string().min(1, "Seleccione un producto."),
            quantitySent: z.number().positive("La cantidad debe ser mayor que cero.")
        })
    ).min(1, "Debe agregar al menos un producto.")

}).superRefine((data, ctx) => {

    if (data.destType === "STORE") {

        if (!data.destStoreId) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Seleccione la tienda o bodega destino.", path: ["destStoreId"] });
            return;
        }

        if (data.destStoreId === data.originStoreId) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El origen y el destino no pueden ser el mismo.", path: ["destStoreId"] });
        }

    }

    if (data.destType === "TECHNICIAN" && !data.destUserId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Seleccione el técnico destino.", path: ["destUserId"] });
    }

});

export type StockTransferFormData = z.infer<typeof stockTransferSchema>;