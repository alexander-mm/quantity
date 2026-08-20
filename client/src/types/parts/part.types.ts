export interface PartCategory {
    id: string;
    uuid: string;
    name: string;
    description: string | null;
    isActive: boolean;
}

export interface Part {
    id: string;
    uuid: string;
    code: string;
    name: string;
    description: string | null;
    categoryId: string | null;
    category: PartCategory | null;
    quantity: string;
    minimumStock: string;
    cost: string;
    isActive: boolean;

    // Costos adicionales opcionales: aplican sin importar si la pieza se corta o se ensambla.
    weldingCost: string | null;
    otherCostDescription: string | null;
    otherCostAmount: string | null;
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
