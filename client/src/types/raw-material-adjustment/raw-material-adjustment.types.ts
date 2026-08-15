export interface RawMaterialAdjustmentDetail {
    id: string;
    quantity: string;
    rawMaterial: {
        id: string;
        code: string;
        name: string;
    };
}

export interface RawMaterialAdjustment {
    id: string;
    number: string;
    type: "IN" | "OUT";
    movementDate: string;
    observations: string | null;
    details: RawMaterialAdjustmentDetail[];
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
