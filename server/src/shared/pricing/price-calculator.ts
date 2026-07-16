export class PriceCalculator {

    /**
     * Calcula el precio de venta
     * aplicando un porcentaje de margen.
     *
     * Ejemplo:
     *
     * costo = 100
     * margen = 30
     *
     * resultado = 130
     */

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