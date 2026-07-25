export interface InventoryStock {
    id: string;
    quantity: string;
    product: {
        id: string;
        internalCode: string;
        name: string;
        minimumStock: string;
    };
    store: {
        id: string;
        name: string;
    };
}
