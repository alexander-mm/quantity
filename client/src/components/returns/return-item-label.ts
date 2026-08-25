import type { Return } from "@/types";

export function getReturnItemLabel(item: Pick<Return, "product" | "part">): string {

    if (item.part) {
        return `${item.part.code} - ${item.part.name} (pieza)`;
    }

    if (item.product) {
        return `${item.product.internalCode} - ${item.product.name}`;
    }

    return "—";

}
