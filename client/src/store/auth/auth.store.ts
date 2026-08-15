import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authStorage } from "./auth.persist";

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

            name: "ordeplus-auth",

            storage: authStorage

        }

    )

);
