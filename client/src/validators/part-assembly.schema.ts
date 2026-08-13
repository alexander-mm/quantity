import { z } from "zod";

export const partAssemblySchema = z.object({
    number: z.string().min(1, "Ingrese el número."),
    partId: z.string().min(1, "Seleccione la pieza a ensamblar."),
    quantity: z.coerce.number({ error: "La cantidad es obligatoria." }).positive("La cantidad debe ser mayor que cero."),
    observations: z.string().optional()
});

export type PartAssemblyFormData = z.input<typeof partAssemblySchema>;