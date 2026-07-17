import { api } from "@/services";

import type {
    LoginRequest,
    LoginResponse
} from "@/types";

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

}

export const authService = new AuthService();