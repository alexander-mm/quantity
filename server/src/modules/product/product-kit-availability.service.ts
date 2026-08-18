import { ProductRepository } from "./product.repository.js";
import { ProductComponentRepository } from "../product-component/product-component.repository.js";
import { EquipmentPartRepository } from "../equipment-part/equipment-part.repository.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";

export interface KitAvailability {
    productId: string;
    quantity: number;
}

// Los kits (Product.assembleOnSale = true) no llevan stock propio: se arman al
// momento de la venta a partir de su receta. Este servicio calcula cuantos kits
// completos se podrian vender ahora mismo, dado el stock disponible de cada
// componente/pieza en una tienda (el minimo entre todos ellos).
export class ProductKitAvailabilityService {

    private readonly productRepository = new ProductRepository();
    private readonly productComponentRepository = new ProductComponentRepository();
    private readonly equipmentPartRepository = new EquipmentPartRepository();
    private readonly inventoryStockService = new InventoryStockService();

    async getForStore(storeId: string): Promise<KitAvailability[]> {

        const products = await this.productRepository.findAll();
        const kits = products.filter(product => product.assembleOnSale);

        return Promise.all(kits.map(async (kit) => ({
            productId: kit.id.toString(),
            quantity: await this.getAvailability(kit.id.toString(), storeId)
        })));

    }

    async getAvailability(
        productId: string,
        storeId: string
    ): Promise<number> {

        const [components, parts] = await Promise.all([
            this.productComponentRepository.findByProduct(BigInt(productId)),
            this.equipmentPartRepository.findByProduct(BigInt(productId))
        ]);

        if (components.length === 0 && parts.length === 0) {
            return 0;
        }

        const possibleQuantities: number[] = [];

        for (const item of components) {

            const stock = await this.inventoryStockService.findByProductAndStore(
                item.componentProductId.toString(),
                storeId
            );

            const available = stock ? Number(stock.quantity) : 0;
            const recipeQuantity = Number(item.quantity);

            possibleQuantities.push(
                recipeQuantity > 0 ? Math.floor(available / recipeQuantity) : 0
            );

        }

        for (const item of parts) {

            const available = Number(item.part.quantity);
            const recipeQuantity = Number(item.quantity);

            possibleQuantities.push(
                recipeQuantity > 0 ? Math.floor(available / recipeQuantity) : 0
            );

        }

        return Math.min(...possibleQuantities);

    }

}
