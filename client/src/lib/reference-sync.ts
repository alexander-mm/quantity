import {
    getClients,
    getStores,
    getProducts,
    getMarginProfiles,
    getUsers,
    getInventoryStock,
    getProductPriceEntryLabels,
    getProductPriceEntries
} from "@/services";
import { useSyncStore } from "@/store";
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

        const [
            clients,
            stores,
            products,
            marginProfiles,
            users,
            inventoryStock,
            priceEntryLabels
        ] = await Promise.all([
            getClients(),
            getStores(),
            getProducts(),
            getMarginProfiles(),
            getUsers(),
            getInventoryStock(),
            getProductPriceEntryLabels()
        ]);

        const priceEntriesByProduct = await mapWithConcurrency(
            products.data,
            PRICE_ENTRY_CONCURRENCY,
            async (product) => {
                const response = await getProductPriceEntries(product.id);
                return { productId: product.id, entries: response.data };
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
                offlineDb.referenceMeta
            ],
            async () => {

                await Promise.all([
                    offlineDb.clients.clear(),
                    offlineDb.stores.clear(),
                    offlineDb.products.clear(),
                    offlineDb.marginProfiles.clear(),
                    offlineDb.users.clear(),
                    offlineDb.inventoryStock.clear(),
                    offlineDb.productPriceEntries.clear()
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
