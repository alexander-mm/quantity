export type RawMaterialShape = "SHEET" | "TUBE" | "ROD";
export type TubeProfile = "ROUND" | "SQUARE" | "RECTANGULAR";

export interface RawMaterialCostingFieldsDto {
    cost?: number;
    wastePercentage?: number;
    laserCostPerMeter?: number;
    mechanicalCutCost?: number;
    bendCostPerBend?: number;
    curveCostPerCurve?: number;
}

export interface CreateRawMaterialDto extends RawMaterialCostingFieldsDto {
    code: string;
    name: string;
    shape: RawMaterialShape;
    material: string;
    thickness: number;
    width?: number;
    height?: number;
    length?: number;
    profile?: TubeProfile;
    minimumStock?: number;
    initialQuantity?: number;
    userId: string;
}

export interface UpdateRawMaterialDto extends RawMaterialCostingFieldsDto {
    code: string;
    name: string;
    shape: RawMaterialShape;
    material: string;
    thickness: number;
    width?: number;
    height?: number;
    length?: number;
    profile?: TubeProfile;
    minimumStock?: number;
}
