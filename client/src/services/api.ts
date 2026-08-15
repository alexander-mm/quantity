import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { env } from "@/config/env";

import { useAuthStore } from "@/store";

import { authService } from "./auth/auth.service";

interface RetriableRequestConfig extends InternalAxiosRequestConfig {

    _retry?: boolean;

}

export const api = axios.create({

    baseURL: env.apiUrl,

    timeout: 10000,

    headers: {

        "Content-Type": "application/json"

    }

});

api.interceptors.request.use(

    (config) => {

        const token = useAuthStore.getState().accessToken;

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

const AUTH_ENDPOINTS = [
    "/auth/login",
    "/auth/refresh",
    "/auth/logout"
];

let refreshPromise: Promise<string> | null = null;

function forceLogout() {

    useAuthStore.getState().logout();

    if (window.location.pathname !== "/") {

        window.location.href = "/";

    }

}

function refreshAccessToken(): Promise<string> {

    if (!refreshPromise) {

        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {

            forceLogout();

            return Promise.reject(
                new Error("No hay refresh token disponible.")
            );

        }

        refreshPromise = authService

            .refresh(refreshToken)

            .then((response) => {

                const { accessToken, refreshToken: newRefreshToken } =
                    response.data;

                useAuthStore.getState().setTokens(
                    accessToken,
                    newRefreshToken
                );

                return accessToken;

            })

            .catch((error) => {

                forceLogout();

                throw error;

            })

            .finally(() => {

                refreshPromise = null;

            });

    }

    return refreshPromise;

}

api.interceptors.response.use(

    (response) => response,

    async (error: AxiosError) => {

        const config = error.config as RetriableRequestConfig | undefined;

        const isAuthEndpoint = AUTH_ENDPOINTS.some(
            (endpoint) => config?.url?.includes(endpoint)
        );

        if (
            error.response?.status !== 401 ||
            !config ||
            config._retry ||
            isAuthEndpoint
        ) {

            return Promise.reject(error);

        }

        config._retry = true;

        try {

            const accessToken = await refreshAccessToken();

            config.headers.Authorization = `Bearer ${accessToken}`;

            return api(config);

        } catch (refreshError) {

            return Promise.reject(refreshError);

        }

    }

);
