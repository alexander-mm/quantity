export interface DamagedStock {
    id: string;
    quantity: string;
    product: {
        id: string;
        internalCode: string;
        name: string;
    };
    store: {
        id: string;
        name: string;
    };
}
