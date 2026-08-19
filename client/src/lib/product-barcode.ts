import type { Product } from "@/types";

export function matchProductByBarcode(
    products: Product[],
    scannedText: string
): Product | undefined {

    const code = scannedText.trim();

    if (!code) {
        return undefined;
    }

    return products.find(product => product.barcode === code);

}
