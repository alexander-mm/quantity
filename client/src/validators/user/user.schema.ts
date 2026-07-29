import { z } from "zod";

export const userSchema = z.object({
    username: z.string().trim().min(3, "El nombre de usuario debe tener al menos 3 caracteres."),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    firstName: z.string().trim().min(1, "El nombre es obligatorio."),
    lastName: z.string().trim().min(1, "El apellido es obligatorio."),
    email: z.string().trim().email("Correo inválido.").optional().or(z.literal("")),
    phone: z.string().trim().optional(),
    roleId: z.string().min(1, "Seleccione un rol."),
    storeId: z.string().min(1, "Seleccione una tienda.")
});

export type UserFormData = z.infer<typeof userSchema>;

export const updateUserSchema = userSchema.extend({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional().or(z.literal(""))
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
