import { z } from "zod";

export const replaceProductPriceEntriesSchema = z.object({
    entries: z.array(z.object({
        currency: z.enum(["USD", "COP"]),
        sequence: z.coerce.number().int().positive(),
        price: z.coerce.number().positive("El precio debe ser mayor que cero.")
    }))
});
