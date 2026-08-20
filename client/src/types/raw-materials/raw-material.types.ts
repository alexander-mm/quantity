export type RawMaterialShape = "SHEET" | "TUBE" | "ROD";
export type TubeProfile = "ROUND" | "SQUARE" | "RECTANGULAR";

export interface RawMaterial {
    id: string;
    uuid: string;
    code: string;
    name: string;
    shape: RawMaterialShape;
    material: string;
    thickness: string;
    width: string | null;
    height: string | null;
    length: string | null;
    profile: TubeProfile | null;
    quantity: string;
    minimumStock: string;
    isActive: boolean;

    // Costeo de producción: todos opcionales.
    cost: string | null;
    wastePercentage: string | null;
    laserCostPerMeter: string | null;
    mechanicalCutCost: string | null;
    bendCostPerBend: string | null;
    curveCostPerCurve: string | null;
}

export type RawMaterialMovementType = "IN" | "OUT";

export interface RawMaterialMovementDetail {
    id: string;
    uuid: string;
    movementId: string;
    rawMaterialId: string;
    quantity: string;
    rawMaterial: RawMaterial;
}

export interface RawMaterialMovement {
    id: string;
    uuid: string;
    number: string;
    type: RawMaterialMovementType;
    userId: string;
    movementDate: string;
    observations: string | null;
    createdAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    details: RawMaterialMovementDetail[];
}
