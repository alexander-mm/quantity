export interface EquipmentPartItemDto {
    partId: string;
    quantity: number;
}

export interface SetEquipmentPartsDto {
    parts: EquipmentPartItemDto[];
}
