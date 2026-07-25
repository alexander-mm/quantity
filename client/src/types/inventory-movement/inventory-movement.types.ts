export interface InventoryMovement {

    id: string;
    quantity: string;
    unitCost: string;
    observations: string | null;
    movementDate: string;
    movementType: {
        id: string;
        name: string;
    };

    product: {
        id: string;
        name: string;
    };

    store: {
        id: string;
        name: string;
    };

    user: {
        id: string;
        firstName: string;
        lastName: string;
    };

    client?: {
        id: string;
        firstName?: string;
        lastName?: string;
        companyName?: string;
    } | null;
}