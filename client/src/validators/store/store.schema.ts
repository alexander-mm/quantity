import { z } from "zod";

export const storeSchema = z.object({
    code: z.string().trim().min(1, "El código es obligatorio.").max(20, "Máximo 20 caracteres."),
    name: z.string().trim().min(1, "El nombre es obligatorio."),
    type: z.enum(["MAIN_WAREHOUSE", "STORE"], { message: "Seleccione el tipo de tienda." }),
    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().email("Correo inválido.").optional().or(z.literal("")),
    manager: z.string().trim().optional(),
    attendanceIp: z.string().trim().optional()
});

export type StoreFormData = z.infer<typeof storeSchema>;
