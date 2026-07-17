import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authStorage } from "./auth.persist";

interface AuthUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    roleId: string;
    storeId: string;
}

interface AuthState {
    token: string | null;

    user: AuthUser | null;

    isAuthenticated: boolean;

    setAuth: (
        token: string,
        user: AuthUser
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

            token: null,

            user: null,

            isAuthenticated: false,

            setAuth: (token, user) =>

                set({

                    token,

                    user,

                    isAuthenticated: true

                }),

            logout: () =>

                set({

                    token: null,

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