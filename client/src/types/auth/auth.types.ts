export interface LoginRequest {

    username: string;

    password: string;

}

export interface AuthUser {

    id: string;

    username: string;

    firstName: string;

    lastName: string;

    roleId: string;

    roleName: string;

    storeId: string;

}

export interface LoginResponse {

    success: boolean;

    message: string;

    data: {

        accessToken: string;

        refreshToken: string;

        user: AuthUser;

    };

}

export interface RefreshResponse {

    success: boolean;

    message: string;

    data: {

        accessToken: string;

        refreshToken: string;

        user: AuthUser;

    };

}