import type { Part, RawMaterial } from "@/types";

export type PartCuttingOrderStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface PartCuttingOrder {
    id: string;
    uuid: string;
    number: string;
    partId: string;
    rawMaterialId: string;
    rawMaterialQtyUsed: string;
    expectedPieces: string;
    goodPieces: string;
    defectivePieces: string;
    status: PartCuttingOrderStatus;
    userId: string;
    cuttingDate: string;
    observations: string | null;
    part: Part;
    rawMaterial: RawMaterial;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
