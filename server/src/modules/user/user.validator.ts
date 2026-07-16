import { z } from "zod";

export const createUserSchema = z.object({

    username: z
        .string()
        .trim()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres.")
        .max(50, "El nombre de usuario no puede superar los 50 caracteres."),

    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres.")
        .max(100, "La contraseña no puede superar los 100 caracteres."),

    firstName: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(100, "El nombre no puede superar los 100 caracteres."),

    lastName: z
        .string()
        .trim()
        .min(1, "El apellido es obligatorio.")
        .max(100, "El apellido no puede superar los 100 caracteres."),

    email: z
        .email("Correo electrónico inválido.")
        .optional()
        .or(z.literal("")),

    phone: z
        .string()
        .trim()
        .max(30, "El teléfono no puede superar los 30 caracteres.")
        .optional(),

    roleId: z
        .number({
            error: "El rol es obligatorio."
        })
        .int()
        .positive(),

    storeId: z
        .number({
            error: "La tienda es obligatoria."
        })
        .int()
        .positive()

});