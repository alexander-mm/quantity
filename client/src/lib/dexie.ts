import Dexie, { type Table } from "dexie";
import type {
    Client,
    Store,
    Product,
    MarginProfile,
    User,
    InventoryStock,
    ProductPriceEntry,
    Role,
    Sale,
    Brand,
    Category,
    UnitOfMeasure,
    Supplier,
    Purchase,
    StockTransfer,
    Part,
    RawMaterial,
    PartCuttingOrder,
    PartAssembly,
    ProductAssembly,
    AccountReceivable,
    MovementType,
    InventoryAdjustment,
    InventoryMovement,
    PartMovement,
    RawMaterialMovement,
    Return
} from "@/types";
import type { PriceEntryLabel } from "@/services";
import type { ProductFormData } from "@/validators";

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

export interface CachedProductDetail extends ProductFormData {
    id: string;
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
    roles!: Table<Role, string>;
    sales!: Table<Sale, string>;
    productDetails!: Table<CachedProductDetail, string>;

    brands!: Table<Brand, string>;
    categories!: Table<Category, string>;
    unitsOfMeasure!: Table<UnitOfMeasure, string>;
    suppliers!: Table<Supplier, string>;
    purchases!: Table<Purchase, string>;
    stockTransfers!: Table<StockTransfer, string>;
    parts!: Table<Part, string>;
    rawMaterials!: Table<RawMaterial, string>;
    partCuttingOrders!: Table<PartCuttingOrder, string>;
    partAssemblies!: Table<PartAssembly, string>;
    productAssemblies!: Table<ProductAssembly, string>;
    accountsReceivable!: Table<AccountReceivable, string>;
    movementTypes!: Table<MovementType, string>;
    inventoryAdjustments!: Table<InventoryAdjustment, string>;
    inventoryMovements!: Table<InventoryMovement, string>;
    partMovements!: Table<PartMovement, string>;
    rawMaterialMovements!: Table<RawMaterialMovement, string>;
    returns!: Table<Return, string>;

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

        this.version(4).stores({
            roles: "id",
            sales: "id, status"
        });

        this.version(5).stores({
            productDetails: "id"
        });

        this.version(6).stores({
            brands: "id",
            categories: "id",
            unitsOfMeasure: "id",
            suppliers: "id",
            purchases: "id, status",
            stockTransfers: "id, status",
            parts: "id, code",
            rawMaterials: "id, code",
            partCuttingOrders: "id, status",
            partAssemblies: "id, status",
            productAssemblies: "id, status",
            accountsReceivable: "id, isPaid",
            movementTypes: "id",
            inventoryAdjustments: "id",
            inventoryMovements: "id",
            partMovements: "id",
            rawMaterialMovements: "id",
            returns: "id, status"
        });
    }

}

export const offlineDb = new QuantityOfflineDB();
