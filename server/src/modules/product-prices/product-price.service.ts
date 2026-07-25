import { ProductPriceRepository } from "./product-price.repository.js";

export class ProductPriceService {

    private readonly repository = new ProductPriceRepository();

    async findByProduct(
        productId: string
    ) {

        const prices = await this.repository.findByProduct(
            BigInt(productId)
        );

        return prices.map(price => ({
            marginProfileId: price.marginProfileId,
            marginProfileName: price.marginProfile.name,
            marginProfilePercentage: price.marginProfile.percentage,
            price: price.price
        }));

    }

}
