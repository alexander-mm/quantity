import { z } from "zod";

export const loginSchema = z.object({

    username: z
        .string()
        .trim()
        .min(1, "El usuario es obligatorio."),

    password: z
        .string()
        .min(1, "La contraseña es obligatoria.")

});

export const refreshTokenSchema = z.object({

    refreshToken: z
        .string()
        .min(1, "El refresh token es obligatorio.")

});