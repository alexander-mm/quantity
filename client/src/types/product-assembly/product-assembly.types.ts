import type { Part, Product } from "@/types";

export interface ProductAssemblyDetail {
    id: string;
    uuid: string;
    assemblyId: string;
    componentProductId: string;
    quantity: string;
    componentProduct: Product;
}

export interface ProductAssemblyPartDetail {
    id: string;
    uuid: string;
    assemblyId: string;
    partId: string;
    quantity: string;
    part: Part;
}

export interface ProductAssemblyPreviewComponent {
    componentProductId: string;
    componentName: string;
    componentCode: string;
    recipeQuantity: number;
    requiredQuantity: number;
    available: number;
    sufficient: boolean;
}

export interface ProductAssemblyPreviewPart {
    partId: string;
    partCode: string;
    partName: string;
    recipeQuantity: number;
    requiredQuantity: number;
    available: number;
    sufficient: boolean;
}

export interface ProductAssemblyPreview {
    product: Product;
    mainWarehouse: {
        id: string;
        name: string;
    };
    components: ProductAssemblyPreviewComponent[];
    parts: ProductAssemblyPreviewPart[];
    canAssemble: boolean;
}

export type ProductAssemblyStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface ProductAssembly {
    id: string;
    uuid: string;
    number: string;
    productId: string;
    quantity: string;
    userId: string;
    status: ProductAssemblyStatus;
    assemblyDate: string;
    observations: string | null;
    createdAt: string;
    product: Product;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    details: ProductAssemblyDetail[];
    partDetails: ProductAssemblyPartDetail[];
}
