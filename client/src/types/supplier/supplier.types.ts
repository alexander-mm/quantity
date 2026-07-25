export interface Supplier {
    id: string;
    uuid: string;
    code: string;
    companyName: string;
    contactName: string | null;
    taxId: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    observations: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}