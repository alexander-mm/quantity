import { useAuthStore } from "@/store";

export function useAuth() {

    const accessToken = useAuthStore((state) => state.accessToken);

    const refreshToken = useAuthStore((state) => state.refreshToken);

    const user = useAuthStore((state) => state.user);

    const isAuthenticated = useAuthStore(

        (state) => state.isAuthenticated

    );

    const setAuth = useAuthStore(

        (state) => state.setAuth

    );

    const setTokens = useAuthStore(

        (state) => state.setTokens

    );

    const logout = useAuthStore(

        (state) => state.logout

    );

    const clearUser = useAuthStore(

        (state) => state.clearUser

    );

    const updateUser = useAuthStore(

        (state) => state.updateUser

    );

    return {

        accessToken,

        refreshToken,

        user,

        isAuthenticated,

        setAuth,

        setTokens,

        logout,

        clearUser,

        updateUser

    };

}
