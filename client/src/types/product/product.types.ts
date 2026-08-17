export interface Product {
    id: string;
    internalCode: string;
    name: string;
    costPrice: string | null;
    price: string | null;
    pvp: string | null;
    pvpCop: string | null;
    minimumStock: string;
    isActive: boolean;
    brand: {
        name: string;
    };
    category: {
        name: string;
    };
    priceEntries: {
        currency: "USD" | "COP";
        sequence: number;
        price: string;
    }[];
}

export interface ProductPrice {
    marginProfileId: string;
    marginProfileName: string;
    marginProfilePercentage: string;
    price: string;
    priceCop: string | null;
}

export interface ProductPriceEntry {
    id: string;
    currency: "USD" | "COP";
    sequence: number;
    label: string;
    price: string;
}

export interface ProductComponent {
    id: string;
    uuid: string;
    productId: string;
    componentProductId: string;
    quantity: string;
    componentProduct: Product;
}