import { z } from "zod";

export const purchaseSchema=z.object({

    number:z
        .string()
        .min(1,"Ingrese el número."),

    supplierId:z
        .string()
        .min(1,"Seleccione un proveedor."),

    storeId:z
        .string()
        .min(1,"Seleccione una bodega."),

    purchaseDate:z
        .string()
        .min(1,"Seleccione la fecha."),

    reference:z
        .string()
        .optional(),

    observations:z
        .string()
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

                unitCost:z
                    .number()
                    .min(0),

                pvp:z
                    .number()
                    .positive("El PVP debe ser mayor que cero."),

                pvpCop:z
                    .number()
                    .positive("El PVP en COP debe ser mayor que cero.")
                    .optional(),

                priceEntries:z
                    .array(
                        z.object({
                            currency:z.enum(["USD","COP"]),
                            sequence:z.number().int().positive(),
                            price:z.number().positive("Debe ser mayor que cero.")
                        })
                    )
                    .optional(),

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

export type PurchaseFormData=
    z.infer<
        typeof purchaseSchema
    >;