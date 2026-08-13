export interface CreatePartAssemblyDto {
    number: string;
    partId: string;
    quantity: number;
    userId: string;
    observations?: string;
}

export interface UpdatePartAssemblyDto {
    number: string;
    partId: string;
    quantity: number;
    observations?: string;
}