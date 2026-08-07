export type RawMaterialShape = "SHEET" | "TUBE" | "ROD";
export type TubeProfile = "ROUND" | "SQUARE" | "RECTANGULAR";

export interface CreateRawMaterialDto {
    code: string;
    name: string;
    shape: RawMaterialShape;
    material: string;
    thickness: number;
    width?: number;
    height?: number;
    length?: number;
    profile?: TubeProfile;
    initialQuantity?: number;
    userId: string;
}

export interface UpdateRawMaterialDto {
    code: string;
    name: string;
    shape: RawMaterialShape;
    material: string;
    thickness: number;
    width?: number;
    height?: number;
    length?: number;
    profile?: TubeProfile;
}
