import { NotFoundError } from "../../shared/errors/index.js";
import { notifyAdmins } from "../../realtime/realtime.service.js";
import { ProductRepository } from "../product/product.repository.js";
import { ProductPriceEntryRepository } from "./product-price-entry.repository.js";
import { ReplaceProductPriceEntriesDto } from "./product-price-entry.dto.js";

export class ProductPriceEntryService {

    private readonly repository = new ProductPriceEntryRepository();
    private readonly productRepository = new ProductRepository();

    async findByProduct(
        productId: string
    ) {

        const entries = await this.repository.findByProduct(
            BigInt(productId)
        );

        return entries.map(entry => ({
            id: entry.id.toString(),
            currency: entry.currency,
            sequence: entry.sequence,
            label: `PVP ${entry.currency} ${entry.sequence}`,
            price: entry.price
        }));

    }

    async replaceForProduct(
        productId: string,
        data: ReplaceProductPriceEntriesDto
    ) {

        const product = await this.productRepository.findById(
            BigInt(productId)
        );

        if (!product) {
            throw new NotFoundError(
                "Producto no encontrado."
            );
        }

        await this.repository.replaceForProduct(
            BigInt(productId),
            data.entries
        );

        notifyAdmins("product:price-changed", {
            productId: product.id.toString(),
            productName: product.name
        });

        return this.findByProduct(productId);

    }

    async findLabels() {

        const maxes = await this.repository.findMaxSequenceByCurrency();
        const labels: { currency: string; sequence: number; label: string }[] = [];

        for (const entry of maxes) {
            for (let sequence = 1; sequence <= entry.maxSequence; sequence++) {
                labels.push({
                    currency: entry.currency,
                    sequence,
                    label: `PVP ${entry.currency} ${sequence}`
                });
            }
        }

        labels.sort((a, b) =>
            a.currency.localeCompare(b.currency) || a.sequence - b.sequence
        );

        return labels;

    }

}
