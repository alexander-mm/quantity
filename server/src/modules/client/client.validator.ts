import { z } from "zod";

export const createClientSchema = z.object({

    document: z
        .string()
        .trim()
        .min(1, "El documento es obligatorio.")
        .max(50, "El documento no puede superar los 50 caracteres."),

    firstName: z
        .string()
        .trim()
        .max(100, "El nombre no puede superar los 100 caracteres.")
        .optional(),

    lastName: z
        .string()
        .trim()
        .max(100, "El apellido no puede superar los 100 caracteres.")
        .optional(),

    companyName: z
        .string()
        .trim()
        .max(150, "La empresa no puede superar los 150 caracteres.")
        .optional(),

    phone: z
        .string()
        .trim()
        .max(30, "El teléfono no puede superar los 30 caracteres.")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Correo electrónico inválido.")
        .max(150, "El correo no puede superar los 150 caracteres.")
        .optional(),

    address: z
        .string()
        .trim()
        .max(255, "La dirección no puede superar los 255 caracteres.")
        .optional()

});