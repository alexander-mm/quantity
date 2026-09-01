import { z } from "zod";

export const generateCustomWeeklyReportSchema = z.object({

    from: z.coerce.date({ error: "Seleccione la fecha inicial." }),
    to: z.coerce.date({ error: "Seleccione la fecha final." })

}).superRefine((data, ctx) => {

    if (data.from > data.to) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La fecha inicial no puede ser posterior a la fecha final.",
            path: ["to"]
        });
    }

});
