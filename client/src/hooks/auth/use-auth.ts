import { useAuthStore } from "@/store";

export function useAuth() {

    const token = useAuthStore((state) => state.token);

    const user = useAuthStore((state) => state.user);

    const isAuthenticated = useAuthStore(

        (state) => state.isAuthenticated

    );

    const setAuth = useAuthStore(

        (state) => state.setAuth

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

        token,

        user,

        isAuthenticated,

        setAuth,

        logout,

        clearUser,

        updateUser

    };

}