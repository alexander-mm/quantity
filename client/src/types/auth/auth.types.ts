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

    storeId: string;

}

export interface LoginResponse {

    success: boolean;

    message: string;

    data: {

        token: string;

        user: AuthUser;

    };

}