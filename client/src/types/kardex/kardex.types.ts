export interface KardexMovement {
    id: string;
    movementDate: string;
    quantity: string;
    unitCost: string;
    observations: string;
    movementType: {
        id: string;
        name: string;
        stockOperation: "IN" | "OUT" | "NONE";
    };
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    client: {
        id: string;
        companyName: string | null;
        firstName: string | null;
        lastName: string | null;
    } | null;
}