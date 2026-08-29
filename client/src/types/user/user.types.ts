export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    roleId: string;
    storeId: string;
    isActive: boolean;
    role: {
        id: string;
        name: string;
    };
    store: {
        id: string;
        name: string;
        type: "MAIN_WAREHOUSE" | "STORE";
    };
}
