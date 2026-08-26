import "dotenv/config";
import { Prisma } from "@prisma/client";
import XLSX from "xlsx";
import { prisma } from "../src/database/prisma/prisma.js";
import { ProductService } from "../src/modules/product/product.service.js";
import { ProductRepository } from "../src/modules/product/product.repository.js";
import { CategoryRepository } from "../src/modules/category/category.repository.js";
import { StoreRepository } from "../src/modules/store/store.repository.js";
import { UserRepository } from "../src/modules/user/user.repository.js";
import { MovementTypeRepository } from "../src/modules/movement-type/movement-type.repository.js";
import { InventoryMovementService } from "../src/modules/inventory-movement/inventory-movement.service.js";
import { ProductPriceEntryService } from "../src/modules/product-price-entries/product-price-entry.service.js";

// Hoja "Productos": catálogo + stock inicial de la tienda destino (--store=).
// Los precios vienen como columnas propias en la misma fila: "USD 1", "USD 2"...,
// "COP 1", "COP 2"... (una columna por cada nivel de PVP del producto).
interface ProductRow {
    "Código Interno"?: string;
    "Nombre"?: string;
    "Código de Barras"?: string | number;
    "Descripción"?: string;
    "Marca"?: string;
    "Categoría"?: string;
    "Unidad de Medida"?: string;
    "Costo"?: number | string;
    "Stock Mínimo"?: number | string;
    "Stock Inicial"?: number | string;
    [priceColumn: string]: unknown;
}

type PriceEntry = { currency: "USD" | "COP"; sequence: number; price: number };

const PRICE_COLUMN_PATTERN = /^(USD|COP)\s+(\d+)$/i;

function parseArgs() {

    const args = process.argv.slice(2);
    const filePath = args.find(arg => !arg.startsWith("--")) ?? "scripts/products.xlsx";
    const storeArg = args.find(arg => arg.startsWith("--store="));
    const userArg = args.find(arg => arg.startsWith("--user="));
    const dryRun = args.includes("--dry-run");

    const storeCode = storeArg?.split("=")[1];
    const username = userArg?.split("=")[1] ?? "admin";

    if (!storeCode) {
        throw new Error(
            "Falta indicar la tienda destino del stock inicial. Uso: --store=<CÓDIGO_DE_TIENDA>"
        );
    }

    return { filePath, storeCode, username, dryRun };

}

function isBlank(value: unknown): boolean {
    return value === undefined || value === null || value === "";
}

function isNumeric(value: unknown): boolean {
    return !isBlank(value) && !isNaN(Number(value));
}

function extractPriceEntries(row: ProductRow): {
    entries: PriceEntry[];
    invalidColumns: string[];
} {

    const entries: PriceEntry[] = [];
    const invalidColumns: string[] = [];

    for (const key of Object.keys(row)) {

        const match = key.match(PRICE_COLUMN_PATTERN);

        if (!match) {
            continue;
        }

        const value = row[key];

        if (isBlank(value)) {
            continue;
        }

        if (!isNumeric(value)) {
            invalidColumns.push(key);
            continue;
        }

        entries.push({
            currency: match[1].toUpperCase() as "USD" | "COP",
            sequence: Number(match[2]),
            price: Number(value)
        });

    }

    return { entries, invalidColumns };

}

async function main() {

    const { filePath, storeCode, username, dryRun } = parseArgs();

    console.log(`Archivo: ${filePath}`);
    console.log(`Tienda destino del stock inicial: ${storeCode}`);
    console.log(dryRun ? "Modo: simulación (--dry-run), no se escribe nada.\n" : "Modo: ejecución real.\n");

    const productService = new ProductService();
    const productRepository = new ProductRepository();
    const categoryRepository = new CategoryRepository();
    const storeRepository = new StoreRepository();
    const userRepository = new UserRepository();
    const movementTypeRepository = new MovementTypeRepository();
    const inventoryMovementService = new InventoryMovementService();
    const productPriceEntryService = new ProductPriceEntryService();

    const store = await storeRepository.findByCode(storeCode);

    if (!store) {
        throw new Error(`No existe una tienda con código "${storeCode}".`);
    }

    const user = await userRepository.findByUsername(username);

    if (!user) {
        throw new Error(`No existe el usuario "${username}" (usado para registrar el stock inicial).`);
    }

    const initialLoadType = await movementTypeRepository.findByCode("INITIAL_LOAD");

    if (!initialLoadType) {
        throw new Error(
            "No existe el tipo de movimiento INITIAL_LOAD. Corre: npx tsx scripts/seed-movement-types.ts"
        );
    }

    const workbook = XLSX.readFile(filePath);

    const productSheet = workbook.Sheets["Productos"];

    if (!productSheet) {
        throw new Error('El archivo debe tener una hoja llamada "Productos".');
    }

    const rows = XLSX.utils.sheet_to_json<ProductRow>(productSheet);

    console.log(`Filas encontradas en "Productos": ${rows.length}\n`);

    const categoryCache = new Map<string, bigint>();
    const codesSeenInFile = new Map<string, number>();

    let created = 0;
    let stockOnly = 0;
    let failed = 0;
    let stockLoadFailed = 0;

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];
        const rowNumber = i + 2; // fila 1 es el encabezado

        const internalCode = row["Código Interno"]?.toString().trim();
        const name = row["Nombre"]?.toString().trim();
        const barcode = row["Código de Barras"]?.toString().trim();
        const description = row["Descripción"]?.toString().trim();
        const brand = row["Marca"]?.toString().trim();
        const categoryName = row["Categoría"]?.toString().trim();
        const unitOfMeasure = row["Unidad de Medida"]?.toString().trim();
        const costPrice = row["Costo"];
        const minimumStock = row["Stock Mínimo"];
        const initialStock = row["Stock Inicial"];

        if (!internalCode) {
            console.error(`❌ Fila ${rowNumber}: falta "Código Interno". Se omite.`);
            failed++;
            continue;
        }

        if (!isBlank(initialStock) && !isNumeric(initialStock)) {
            console.error(`❌ Fila ${rowNumber} (${internalCode}): "Stock Inicial" no es numérico (${JSON.stringify(initialStock)}). Se omite.`);
            failed++;
            continue;
        }

        const seenAt = codesSeenInFile.get(internalCode);

        if (seenAt !== undefined) {
            console.error(`❌ Fila ${rowNumber}: código "${internalCode}" ya apareció en la fila ${seenAt} de este mismo archivo (con datos distintos). Se omite; corrige el código duplicado en el Excel.`);
            failed++;
            continue;
        }

        codesSeenInFile.set(internalCode, rowNumber);

        const { entries, invalidColumns } = extractPriceEntries(row);

        if (invalidColumns.length > 0) {
            console.error(`❌ Fila ${rowNumber} (${internalCode}): columnas de precio no numéricas: ${invalidColumns.join(", ")}. Se omite.`);
            failed++;
            continue;
        }

        try {

            let productId: bigint;

            const existing = await productRepository.findByInternalCode(internalCode);

            if (existing) {

                // Producto ya creado (normalmente por el archivo de la Bodega Principal):
                // solo nos interesa sumarle stock en esta tienda, no volvemos a exigir
                // Marca/Categoría/Unidad/Precios que probablemente ni vengan en este archivo.
                productId = existing.id;
                console.log(`↷  Fila ${rowNumber}: "${internalCode}" ya existe, no se vuelve a crear ni se tocan sus precios.`);
                stockOnly++;

            } else {

                if (
                    !name ||
                    !brand ||
                    !categoryName ||
                    !unitOfMeasure ||
                    isBlank(costPrice) ||
                    isBlank(minimumStock)
                ) {
                    console.error(`❌ Fila ${rowNumber} (${internalCode}): es un producto nuevo (no existe aún) y le faltan campos obligatorios (Nombre/Marca/Categoría/Unidad de Medida/Costo/Stock Mínimo). Se omite.`);
                    failed++;
                    continue;
                }

                if (!isNumeric(costPrice)) {
                    console.error(`❌ Fila ${rowNumber} (${internalCode}): "Costo" no es numérico (${JSON.stringify(costPrice)}, revisa si hay una fórmula rota tipo #REF!). Se omite.`);
                    failed++;
                    continue;
                }

                if (!isNumeric(minimumStock)) {
                    console.error(`❌ Fila ${rowNumber} (${internalCode}): "Stock Mínimo" no es numérico (${JSON.stringify(minimumStock)}). Se omite.`);
                    failed++;
                    continue;
                }

                const firstUsd = entries.find(entry => entry.currency === "USD" && entry.sequence === 1);
                const firstCop = entries.find(entry => entry.currency === "COP" && entry.sequence === 1);

                if (!firstUsd) {
                    console.error(`❌ Fila ${rowNumber}: "${internalCode}" no tiene la columna "USD 1" llena (se necesita al menos ese precio base). Se omite.`);
                    failed++;
                    continue;
                }

                let categoryId = categoryCache.get(categoryName);

                if (!categoryId) {

                    let category = await categoryRepository.findByName(categoryName);

                    if (!category) {

                        if (dryRun) {
                            console.log(`   ↳ (simulación) se crearía la categoría: ${categoryName}`);
                        } else {
                            category = await categoryRepository.create({ name: categoryName });
                            console.log(`   ↳ Categoría creada: ${categoryName}`);
                        }

                    }

                    categoryId = category?.id ?? -1n; // -1n solo se usa en dry-run, nunca se persiste
                    categoryCache.set(categoryName, categoryId);

                }

                if (dryRun) {

                    console.log(`✅ Fila ${rowNumber}: (simulación) se crearía "${internalCode}" - ${name} con ${entries.length} precio(s) (USD 1 = ${firstUsd.price})`);
                    created++;
                    productId = -1n; // solo se usa en dry-run, nunca se persiste

                } else {

                    const product = await productService.create({
                        internalCode,
                        barcode: barcode || null,
                        name,
                        description: description || undefined,
                        brand,
                        categoryId,
                        unitOfMeasure,
                        baseCostPrice: Number(costPrice),
                        pvp: firstUsd.price,
                        pvpCop: firstCop?.price,
                        minimumStock: Number(minimumStock)
                    });

                    productId = product.id;

                    await productPriceEntryService.replaceForProduct(
                        productId.toString(),
                        { entries }
                    );

                    console.log(`✅ Fila ${rowNumber}: creado "${internalCode}" - ${name} con ${entries.length} precio(s)`);
                    created++;

                }

            }

            if (!isBlank(initialStock) && Number(initialStock) > 0) {

                if (isBlank(costPrice) || !isNumeric(costPrice)) {

                    console.error(`❌ Fila ${rowNumber} (${internalCode}): tiene "Stock Inicial" pero "Costo" no es válido (${JSON.stringify(costPrice)}), no se puede registrar el movimiento de stock. Se omite solo la carga de stock.`);
                    stockLoadFailed++;

                } else if (dryRun) {

                    console.log(`   ↳ (simulación) se cargarían ${initialStock} unidades en ${store.name}`);

                } else {

                    await inventoryMovementService.create({
                        movementTypeId: initialLoadType.id,
                        productId,
                        storeId: store.id,
                        userId: user.id,
                        quantity: new Prisma.Decimal(Number(initialStock)),
                        unitCost: new Prisma.Decimal(Number(costPrice)),
                        observations: `Carga inicial de importación (${store.name})`,
                        movementDate: new Date()
                    });

                    console.log(`   ↳ Stock inicial cargado: ${initialStock} en ${store.name}`);

                }

            }

        } catch (error) {

            const message = error instanceof Error ? error.message : String(error);
            console.error(`❌ Fila ${rowNumber} (${internalCode}): ${message}`);
            failed++;

        }

    }

    console.log("\n====================================");
    console.log(`Productos nuevos: ${created}`);
    console.log(`Solo se agregó stock (ya existían): ${stockOnly}`);
    console.log(`Con error: ${failed}`);
    if (stockLoadFailed > 0) {
        console.log(`⚠️  Con stock sin cargar por costo inválido: ${stockLoadFailed}`);
    }
    console.log("====================================");

}

main()
    .catch(error => {
        console.error("Error inesperado:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
