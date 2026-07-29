export interface Product {
    id: string;
    internalCode: string;
    name: string;
    price: string | null;
    pvp: string | null;
    minimumStock: string;
    isActive: boolean;
    brand: {
        name: string;
    };
    category: {
        name: string;
    };
}

export interface ProductPrice {
    marginProfileId: string;
    marginProfileName: string;
    marginProfilePercentage: string;
    price: string;
}