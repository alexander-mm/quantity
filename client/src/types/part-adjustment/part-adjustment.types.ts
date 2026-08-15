export interface PartAdjustmentDetail {
    id: string;
    quantity: string;
    part: {
        id: string;
        code: string;
        name: string;
    };
}

export interface PartAdjustment {
    id: string;
    number: string;
    type: "IN" | "OUT";
    movementDate: string;
    observations: string | null;
    details: PartAdjustmentDetail[];
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
