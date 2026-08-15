import axios from "axios";

import { api } from "@/services";

import { env } from "@/config/env";

import type {
    LoginRequest,
    LoginResponse,
    RefreshResponse
} from "@/types";

const refreshClient = axios.create({

    baseURL: env.apiUrl,

    timeout: 10000,

    headers: {
        "Content-Type": "application/json"
    }

});

export class AuthService {

    async login(
        credentials: LoginRequest
    ): Promise<LoginResponse> {

        const { data } = await api.post<LoginResponse>(
            "/auth/login",
            credentials
        );

        return data;

    }

    async refresh(
        refreshToken: string
    ): Promise<RefreshResponse> {

        const { data } = await refreshClient.post<RefreshResponse>(
            "/auth/refresh",
            { refreshToken }
        );

        return data;

    }

    async logout(
        refreshToken: string
    ): Promise<void> {

        await refreshClient.post(
            "/auth/logout",
            { refreshToken }
        );

    }

}

export const authService = new AuthService();
