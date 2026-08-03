export interface Client {
    id: string;
    uuid: string;
    document: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    discountPercentage: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
