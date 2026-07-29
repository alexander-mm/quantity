export class PriceCalculator {

    static calculateSalePriceFromDiscount(
        pvp: number,
        discountPercentage: number
    ): number {
        const salePrice =
            pvp *
            (1 - (discountPercentage / 100));

        return Number(
            salePrice.toFixed(2)
        );
    }
}