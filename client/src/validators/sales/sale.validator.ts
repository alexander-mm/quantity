import { z } from "zod";

export const saleSchema=z.object({

    number:z
        .string()
        .min(1,"Ingrese el número."),

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

    accountReceivableNumber:z
        .string()
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
                    .number()
                    .positive(),

                unitPrice:z
                    .number()
                    .min(0),

                discount:z
                    .number()
                    .min(0),

                tax:z
                    .number()
                    .min(0)

            })

        )
        .min(
            1,
            "Debe agregar al menos un producto."
        )

});

export type SaleFormData=
    z.infer<
        typeof saleSchema
    >;
