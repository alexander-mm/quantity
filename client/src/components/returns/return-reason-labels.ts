import type { ReturnReason } from "@/types";

export const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
    DAMAGED: "Dañado",
    CUSTOMER_CHANGED_MIND: "Cliente se arrepintió",
    WRONG_ITEM: "Producto incorrecto",
    INCOMPATIBLE: "Incompatible",
    WARRANTY: "Garantía",
    OTHER: "Otro"
};
