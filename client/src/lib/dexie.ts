import Dexie, { type Table } from "dexie";
import type {
    Client,
    Store,
    Product,
    MarginProfile,
    User,
    InventoryStock,
    ProductPriceEntry
} from "@/types";
import type { PriceEntryLabel } from "@/services";

export type OutboxStatus = "pending" | "syncing" | "synced" | "error";

export interface OutboxItem {
    id: string;
    entity: string;
    operation: "create" | "update";
    method: "POST" | "PUT" | "PATCH";
    endpoint: string;
    payload: unknown;
    status: OutboxStatus;
    attempts: number;
    lastError?: string;
    createdAt: number;
    updatedAt: number;
    storeId?: string;
    userId?: string;
}

export interface CachedProductPriceEntries {
    productId: string;
    entries: ProductPriceEntry[];
}

export interface CachedPriceEntryLabels {
    key: "labels";
    labels: PriceEntryLabel[];
}

export interface ReferenceSyncMeta {
    key: string;
    lastSyncedAt: number;
}

class QuantityOfflineDB extends Dexie {

    outbox!: Table<OutboxItem, string>;

    clients!: Table<Client, string>;
    stores!: Table<Store, string>;
    products!: Table<Product, string>;
    marginProfiles!: Table<MarginProfile, string>;
    users!: Table<User, string>;
    inventoryStock!: Table<InventoryStock, string>;
    productPriceEntries!: Table<CachedProductPriceEntries, string>;
    priceEntryLabels!: Table<CachedPriceEntryLabels, string>;
    referenceMeta!: Table<ReferenceSyncMeta, string>;

    constructor() {
        super("quantity-offline");

        this.version(1).stores({
            outbox: "id, entity, status, createdAt"
        });

        this.version(2).stores({
            clients: "id",
            stores: "id",
            products: "id, internalCode",
            marginProfiles: "id",
            users: "id",
            inventoryStock: "id",
            productPriceEntries: "productId",
            priceEntryLabels: "key",
            referenceMeta: "key"
        });

        this.version(3).stores({
            outbox: "id, entity, status, createdAt, userId"
        });
    }

}

export const offlineDb = new QuantityOfflineDB();
