import { z } from "zod";

export const updateMinimumStockSchema = z.object({

    minimumStock: z
        .coerce
        .number({
            error: "El stock mínimo es obligatorio."
        })
        .min(0, "El stock mínimo no puede ser negativo.")

});
