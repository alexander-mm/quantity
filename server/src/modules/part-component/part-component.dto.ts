export interface PartComponentItemDto {
    componentPartId: string;
    quantity: number;
}

export interface SetPartComponentsDto {
    components: PartComponentItemDto[];
}