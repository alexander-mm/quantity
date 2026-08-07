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
interface ProductRow {
    "Código Interno"?: string;
    "Nombre"?: string;
    "Código de Barras"?: string | number;
    "Descripción"?: string;
    "Marca"?: string;
    "Categoría"?: string;
    "Unidad de Medida"?: string;
    "Costo"?: number;
    "Stock Mínimo"?: number;
    "Stock Inicial"?: number;
}

// Hoja "Precios": una fila por cada nivel de PVP del producto. El orden de las filas
// define la secuencia (PVP USD 1, PVP USD 2... PVP COP 1...), igual que al agregarlos
// uno por uno desde el formulario de producto.
interface PriceRow {
    "Código Interno"?: string;
    "Moneda"?: string;
    "Precio"?: number;
}

type PriceEntry = { currency: "USD" | "COP"; sequence: number; price: number };

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

function buildPriceEntriesByCode(priceRows: PriceRow[]): Map<string, PriceEntry[]> {

    const priceEntriesByCode = new Map<string, PriceEntry[]>();
    const sequenceCounters = new Map<string, number>();

    for (let i = 0; i < priceRows.length; i++) {

        const row = priceRows[i];
        const rowNumber = i + 2;

        const code = row["Código Interno"]?.toString().trim();
        const currencyRaw = row["Moneda"]?.toString().trim().toUpperCase();
        const price = row["Precio"];

        if (!code || (currencyRaw !== "USD" && currencyRaw !== "COP") || price === undefined) {
            console.error(`❌ Hoja "Precios", fila ${rowNumber}: inválida (revisa Código Interno / Moneda / Precio). Se omite.`);
            continue;
        }

        const currency = currencyRaw as "USD" | "COP";
        const counterKey = `${code}|${currency}`;
        const sequence = (sequenceCounters.get(counterKey) ?? 0) + 1;
        sequenceCounters.set(counterKey, sequence);

        const list = priceEntriesByCode.get(code) ?? [];
        list.push({ currency, sequence, price: Number(price) });
        priceEntriesByCode.set(code, list);

    }

    return priceEntriesByCode;

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
    const priceSheet = workbook.Sheets["Precios"];

    if (!productSheet) {
        throw new Error('El archivo debe tener una hoja llamada "Productos".');
    }

    if (!priceSheet) {
        throw new Error('El archivo debe tener una hoja llamada "Precios" (un renglón por cada PVP USD/COP del producto).');
    }

    const rows = XLSX.utils.sheet_to_json<ProductRow>(productSheet);
    const priceRows = XLSX.utils.sheet_to_json<PriceRow>(priceSheet);
    const priceEntriesByCode = buildPriceEntriesByCode(priceRows);
    const usedPriceCodes = new Set<string>();

    console.log(`Filas encontradas en "Productos": ${rows.length}`);
    console.log(`Filas encontradas en "Precios": ${priceRows.length}\n`);

    const categoryCache = new Map<string, bigint>();

    let created = 0;
    let stockOnly = 0;
    let failed = 0;

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

        if (
            !internalCode ||
            !name ||
            !brand ||
            !categoryName ||
            !unitOfMeasure ||
            costPrice === undefined ||
            minimumStock === undefined
        ) {
            console.error(`❌ Fila ${rowNumber}: faltan campos obligatorios. Se omite.`);
            failed++;
            continue;
        }

        if (internalCode) {
            usedPriceCodes.add(internalCode);
        }

        try {

            let productId: bigint;

            const existing = await productRepository.findByInternalCode(internalCode);

            if (existing) {

                productId = existing.id;
                console.log(`↷  Fila ${rowNumber}: "${internalCode}" ya existe, no se vuelve a crear ni se tocan sus precios.`);
                stockOnly++;

            } else {

                const entries = priceEntriesByCode.get(internalCode) ?? [];
                const firstUsd = entries.find(entry => entry.currency === "USD" && entry.sequence === 1);
                const firstCop = entries.find(entry => entry.currency === "COP" && entry.sequence === 1);

                if (!firstUsd) {
                    console.error(`❌ Fila ${rowNumber}: "${internalCode}" no tiene ningún precio USD en la hoja "Precios" (se necesita al menos uno). Se omite.`);
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
                    continue;
                }

                const product = await productService.create({
                    internalCode,
                    barcode: barcode || null,
                    name,
                    description: description || undefined,
                    brand,
                    categoryId,
                    unitOfMeasure,
                    costPrice: Number(costPrice),
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

            if (initialStock !== undefined && Number(initialStock) > 0) {

                if (dryRun) {
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

    const orphanPriceCodes = [...priceEntriesByCode.keys()].filter(code => !usedPriceCodes.has(code));

    console.log("\n====================================");
    console.log(`Productos nuevos: ${created}`);
    console.log(`Solo se agregó stock (ya existían): ${stockOnly}`);
    console.log(`Con error: ${failed}`);
    if (orphanPriceCodes.length > 0) {
        console.log(`⚠️  Códigos en "Precios" sin fila correspondiente en "Productos": ${orphanPriceCodes.join(", ")}`);
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
