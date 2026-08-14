import {
    getClients,
    getStores,
    getProducts,
    getMarginProfiles,
    getUsers,
    getInventoryStock,
    getProductPriceEntryLabels,
    getProductPriceEntries,
    getProductById,
    getRoles,
    getSales,
    getBrands,
    getCategories,
    getUnitsOfMeasure,
    getSuppliers,
    getPurchases,
    getStockTransfers,
    getParts,
    getRawMaterials,
    getPartCuttingOrders,
    getPartAssemblies,
    getProductAssemblies,
    getAccountsReceivable,
    getMovementTypes,
    getInventoryAdjustments,
    getInventoryMovements,
    getPartMovements,
    getRawMaterialMovements,
    getReturns
} from "@/services";
import { useSyncStore, useAuthStore } from "@/store";
import { ROLES } from "@/constants/roles";
import { offlineDb } from "./dexie";

const PRICE_ENTRY_CONCURRENCY = 8;

async function mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {

    const results: R[] = new Array(items.length);
    let cursor = 0;

    async function worker() {
        while (cursor < items.length) {
            const current = cursor++;
            results[current] = await fn(items[current]);
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, worker)
    );

    return results;

}

let syncInFlight: Promise<void> | null = null;

export function syncReferenceData(): Promise<void> {

    if (syncInFlight) {
        return syncInFlight;
    }

    syncInFlight = runSync().finally(() => {
        syncInFlight = null;
    });

    return syncInFlight;

}

async function runSync(): Promise<void> {

    const { setSyncing, setSuccess, setError } = useSyncStore.getState();

    setSyncing();

    try {

        const currentUser = useAuthStore.getState().user;
        const isAdmin = currentUser?.roleName === ROLES.ADMIN;
        const storeId = currentUser?.storeId;

        const [
            clients,
            stores,
            products,
            marginProfiles,
            users,
            inventoryStock,
            priceEntryLabels,
            roles,
            sales,
            brands,
            categories,
            unitsOfMeasure,
            suppliers,
            purchases,
            stockTransfers,
            parts,
            rawMaterials,
            partCuttingOrders,
            partAssemblies,
            productAssemblies,
            accountsReceivable,
            movementTypes,
            inventoryAdjustments,
            inventoryMovements,
            partMovements,
            rawMaterialMovements,
            returns
        ] = await Promise.all([
            getClients(),
            getStores(),
            getProducts(),
            getMarginProfiles(),
            getUsers(),
            getInventoryStock(),
            getProductPriceEntryLabels(),
            getRoles(),
            getSales(),
            getBrands(),
            getCategories(),
            getUnitsOfMeasure(),
            getSuppliers(),
            getPurchases(),
            getStockTransfers(),
            getParts(),
            getRawMaterials(),
            getPartCuttingOrders(),
            getPartAssemblies(),
            getProductAssemblies(),
            getAccountsReceivable(),
            getMovementTypes(),
            getInventoryAdjustments(),
            getInventoryMovements(),
            getPartMovements(),
            getRawMaterialMovements(),
            getReturns()
        ]);

        // El inventario ya llega filtrado por tienda desde el backend para roles no-admin.
        // Las ventas y otros documentos con tienda propia no, así que para no descargar
        // los de todas las sucursales en un dispositivo de tienda, se filtran aquí.
        const scopedSales = isAdmin
            ? sales.data
            : sales.data.filter(sale => sale.store.id === storeId);

        const scopedPurchases = isAdmin
            ? purchases.data
            : purchases.data.filter(purchase => purchase.store.id === storeId);

        const scopedStockTransfers = isAdmin
            ? stockTransfers.data
            : stockTransfers.data.filter(transfer =>
                transfer.originStore.id === storeId || transfer.destStore?.id === storeId
            );

        const scopedInventoryAdjustments = isAdmin
            ? inventoryAdjustments.data
            : inventoryAdjustments.data.filter(adjustment => adjustment.store.id === storeId);

        const scopedInventoryMovements = isAdmin
            ? inventoryMovements.data
            : inventoryMovements.data.filter(movement => movement.store.id === storeId);

        const scopedReturns = isAdmin
            ? returns.data
            : returns.data.filter(item => item.store.id === storeId);

        const priceEntriesByProduct = await mapWithConcurrency(
            products.data,
            PRICE_ENTRY_CONCURRENCY,
            async (product) => {
                const response = await getProductPriceEntries(product.id);
                return { productId: product.id, entries: response.data };
            }
        );

        const productDetails = await mapWithConcurrency(
            products.data,
            PRICE_ENTRY_CONCURRENCY,
            async (product) => {
                const response = await getProductById(product.id);
                return { ...response.data, id: product.id };
            }
        );

        await offlineDb.transaction(
            "rw",
            [
                offlineDb.clients,
                offlineDb.stores,
                offlineDb.products,
                offlineDb.marginProfiles,
                offlineDb.users,
                offlineDb.inventoryStock,
                offlineDb.productPriceEntries,
                offlineDb.priceEntryLabels,
                offlineDb.referenceMeta,
                offlineDb.roles,
                offlineDb.sales,
                offlineDb.productDetails,
                offlineDb.brands,
                offlineDb.categories,
                offlineDb.unitsOfMeasure,
                offlineDb.suppliers,
                offlineDb.purchases,
                offlineDb.stockTransfers,
                offlineDb.parts,
                offlineDb.rawMaterials,
                offlineDb.partCuttingOrders,
                offlineDb.partAssemblies,
                offlineDb.productAssemblies,
                offlineDb.accountsReceivable,
                offlineDb.movementTypes,
                offlineDb.inventoryAdjustments,
                offlineDb.inventoryMovements,
                offlineDb.partMovements,
                offlineDb.rawMaterialMovements,
                offlineDb.returns
            ],
            async () => {

                await Promise.all([
                    offlineDb.clients.clear(),
                    offlineDb.stores.clear(),
                    offlineDb.products.clear(),
                    offlineDb.marginProfiles.clear(),
                    offlineDb.users.clear(),
                    offlineDb.inventoryStock.clear(),
                    offlineDb.productPriceEntries.clear(),
                    offlineDb.roles.clear(),
                    offlineDb.sales.clear(),
                    offlineDb.productDetails.clear(),
                    offlineDb.brands.clear(),
                    offlineDb.categories.clear(),
                    offlineDb.unitsOfMeasure.clear(),
                    offlineDb.suppliers.clear(),
                    offlineDb.purchases.clear(),
                    offlineDb.stockTransfers.clear(),
                    offlineDb.parts.clear(),
                    offlineDb.rawMaterials.clear(),
                    offlineDb.partCuttingOrders.clear(),
                    offlineDb.partAssemblies.clear(),
                    offlineDb.productAssemblies.clear(),
                    offlineDb.accountsReceivable.clear(),
                    offlineDb.movementTypes.clear(),
                    offlineDb.inventoryAdjustments.clear(),
                    offlineDb.inventoryMovements.clear(),
                    offlineDb.partMovements.clear(),
                    offlineDb.rawMaterialMovements.clear(),
                    offlineDb.returns.clear()
                ]);

                await Promise.all([
                    offlineDb.clients.bulkPut(clients.data),
                    offlineDb.stores.bulkPut(stores.data),
                    offlineDb.products.bulkPut(products.data),
                    offlineDb.marginProfiles.bulkPut(marginProfiles.data),
                    offlineDb.users.bulkPut(users.data),
                    offlineDb.inventoryStock.bulkPut(inventoryStock.data),
                    offlineDb.productPriceEntries.bulkPut(priceEntriesByProduct),
                    offlineDb.priceEntryLabels.put({ key: "labels", labels: priceEntryLabels.data }),
                    offlineDb.roles.bulkPut(roles.data),
                    offlineDb.sales.bulkPut(scopedSales),
                    offlineDb.productDetails.bulkPut(productDetails),
                    offlineDb.brands.bulkPut(brands.data),
                    offlineDb.categories.bulkPut(categories.data),
                    offlineDb.unitsOfMeasure.bulkPut(unitsOfMeasure.data),
                    offlineDb.suppliers.bulkPut(suppliers.data),
                    offlineDb.purchases.bulkPut(scopedPurchases),
                    offlineDb.stockTransfers.bulkPut(scopedStockTransfers),
                    offlineDb.parts.bulkPut(parts.data),
                    offlineDb.rawMaterials.bulkPut(rawMaterials.data),
                    offlineDb.partCuttingOrders.bulkPut(partCuttingOrders.data),
                    offlineDb.partAssemblies.bulkPut(partAssemblies.data),
                    offlineDb.productAssemblies.bulkPut(productAssemblies.data),
                    offlineDb.accountsReceivable.bulkPut(accountsReceivable.data),
                    offlineDb.movementTypes.bulkPut(movementTypes.data),
                    offlineDb.inventoryAdjustments.bulkPut(scopedInventoryAdjustments),
                    offlineDb.inventoryMovements.bulkPut(scopedInventoryMovements),
                    offlineDb.partMovements.bulkPut(partMovements.data),
                    offlineDb.rawMaterialMovements.bulkPut(rawMaterialMovements.data),
                    offlineDb.returns.bulkPut(scopedReturns),
                    offlineDb.referenceMeta.put({ key: "reference", lastSyncedAt: Date.now() })
                ]);

            }
        );

        setSuccess(Date.now());

    } catch (error) {

        const message = error instanceof Error ? error.message : "No se pudo sincronizar la información.";
        setError(message);
        throw error;

    }

}

export async function getCachedProductDetail(productId: string) {
    return offlineDb.productDetails.get(productId);
}

export async function getCachedPriceEntryLabels() {
    const cached = await offlineDb.priceEntryLabels.get("labels");
    return cached?.labels ?? [];
}

export async function getCachedProductPriceEntries(productId: string) {
    const cached = await offlineDb.productPriceEntries.get(productId);
    return cached?.entries ?? [];
}

export async function resolveProductPriceEntries(productId: string) {

    if (navigator.onLine) {

        try {
            const response = await getProductPriceEntries(productId);
            return response.data;
        } catch {
            // sin conexión real pese a navigator.onLine (ej. red cautiva) — se usa el caché local
        }

    }

    return getCachedProductPriceEntries(productId);

}
