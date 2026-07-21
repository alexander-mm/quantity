export class PriceCalculator {

    static calculateSalePrice(
        costPrice: number,
        marginPercentage: number
    ): number {
        const salePrice =
            costPrice *
            (1 + (marginPercentage / 100));

        return Number(
            salePrice.toFixed(2)
        );
    }
}