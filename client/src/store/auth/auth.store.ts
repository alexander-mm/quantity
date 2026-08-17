import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authStorage } from "./auth.persist";

const AUTH_STORAGE_KEY = "ordeplus-auth";

interface AuthUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    roleId: string;
    roleName: string;
    storeId: string;
}

interface AuthState {
    accessToken: string | null;

    refreshToken: string | null;

    user: AuthUser | null;

    isAuthenticated: boolean;

    setAuth: (
        accessToken: string,
        refreshToken: string,
        user: AuthUser
    ) => void;

    setTokens: (
        accessToken: string,
        refreshToken: string
    ) => void;

    logout: () => void;

    clearUser: () => void;

    updateUser: (
        user: AuthUser
    ) => void;
}

export const useAuthStore = create<AuthState>()(

    persist(

        (set) => ({

            accessToken: null,

            refreshToken: null,

            user: null,

            isAuthenticated: false,

            setAuth: (accessToken, refreshToken, user) =>

                set({

                    accessToken,

                    refreshToken,

                    user,

                    isAuthenticated: true

                }),

            setTokens: (accessToken, refreshToken) =>

                set({

                    accessToken,

                    refreshToken

                }),

            logout: () =>

                set({

                    accessToken: null,

                    refreshToken: null,

                    user: null,

                    isAuthenticated: false

                }),

            clearUser: () =>

                set({

                    user: null

                }),

            updateUser: (user) =>

                set({

                    user

                })

        }),

        {

            name: AUTH_STORAGE_KEY,

            storage: authStorage

        }

    )

);

// Si otra pestaña del mismo navegador rota el access/refresh token (por ejemplo
// al renovar la sesion), esta pestana solo se entera leyendo localStorage de nuevo:
// el estado en memoria de zustand no se re-sincroniza solo entre pestanas. Sin esto,
// una pestana con el token viejo en memoria puede intentar refrescar con un token ya
// rotado por otra pestana, fallar, y cerrar la sesion de todas (porque logout() borra
// el localStorage compartido).
if (typeof window !== "undefined") {

    window.addEventListener("storage", (event) => {

        if (event.key === AUTH_STORAGE_KEY) {

            void useAuthStore.persist.rehydrate();

        }

    });

}
