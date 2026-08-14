import type { Part, Product } from "@/types";

export interface PartAssemblyDetail {
    id: string;
    uuid: string;
    assemblyId: string;
    componentPartId: string;
    quantity: string;
    componentPart: Part;
}

export interface PartAssemblyProductDetail {
    id: string;
    uuid: string;
    assemblyId: string;
    componentProductId: string;
    quantity: string;
    componentProduct: Product;
}

export interface PartAssemblyPreviewComponent {
    componentPartId: string;
    componentCode: string;
    componentName: string;
    recipeQuantity: number;
    requiredQuantity: number;
    available: number;
    sufficient: boolean;
}

export interface PartAssemblyPreviewProduct {
    componentProductId: string;
    componentCode: string;
    componentName: string;
    recipeQuantity: number;
    requiredQuantity: number;
    available: number;
    sufficient: boolean;
}

export interface PartAssemblyPreview {
    part: Part;
    mainWarehouse: {
        id: string;
        name: string;
    };
    components: PartAssemblyPreviewComponent[];
    products: PartAssemblyPreviewProduct[];
    canAssemble: boolean;
}

export type PartAssemblyStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface PartAssembly {
    id: string;
    uuid: string;
    number: string;
    partId: string;
    quantity: string;
    userId: string;
    status: PartAssemblyStatus;
    assemblyDate: string;
    observations: string | null;
    createdAt: string;
    part: Part;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    details: PartAssemblyDetail[];
    productDetails: PartAssemblyProductDetail[];
}