import type { Part } from "@/types";

export interface PartComponent {
    id: string;
    uuid: string;
    partId: string;
    componentPartId: string;
    quantity: string;
    componentPart: Part;
}