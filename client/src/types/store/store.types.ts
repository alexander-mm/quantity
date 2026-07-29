export interface Store {
    id: string;
    code: string;
    name: string;
    type: "MAIN_WAREHOUSE" | "STORE";
    address: string | null;
    city: string | null;
    phone: string | null;
    email: string | null;
    manager: string | null;
    isActive: boolean;
}
