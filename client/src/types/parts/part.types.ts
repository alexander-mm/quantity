export interface Part {
    id: string;
    uuid: string;
    code: string;
    name: string;
    description: string | null;
    quantity: string;
    isActive: boolean;
}

export type PartMovementType = "IN" | "OUT";

export interface PartMovementDetail {
    id: string;
    uuid: string;
    movementId: string;
    partId: string;
    quantity: string;
    part: Part;
}

export interface PartMovement {
    id: string;
    uuid: string;
    number: string;
    type: PartMovementType;
    userId: string;
    movementDate: string;
    observations: string | null;
    createdAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    details: PartMovementDetail[];
}
