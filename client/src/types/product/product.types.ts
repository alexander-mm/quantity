export interface Product {
    id: string;
    internalCode: string;
    name: string;
    price: string | null;
    minimumStock: string;
    isActive: boolean;
    brand: {
        name: string;
    };
    category: {
        name: string;
    };
}