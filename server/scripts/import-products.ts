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

interface ExcelRow {
    "Código Interno"?: string;
    "Nombre"?: string;
    "Código de Barras"?: string | number;
    "Descripción"?: string;
    "Marca"?: string;
    "Categoría"?: string;
    "Unidad de Medida"?: string;
    "Costo"?: number;
    "PVP (USD)"?: number;
    "PVP (COP)"?: number;
    "Stock Mínimo"?: number;
    "Stock Inicial"?: number;
}

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
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    console.log(`Filas encontradas: ${rows.length}\n`);

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
        const pvp = row["PVP (USD)"];
        const pvpCop = row["PVP (COP)"];
        const minimumStock = row["Stock Mínimo"];
        const initialStock = row["Stock Inicial"];

        if (
            !internalCode ||
            !name ||
            !brand ||
            !categoryName ||
            !unitOfMeasure ||
            costPrice === undefined ||
            pvp === undefined ||
            minimumStock === undefined
        ) {
            console.error(`❌ Fila ${rowNumber}: faltan campos obligatorios. Se omite.`);
            failed++;
            continue;
        }

        try {

            let productId: bigint;

            const existing = await productRepository.findByInternalCode(internalCode);

            if (existing) {

                productId = existing.id;
                console.log(`↷  Fila ${rowNumber}: "${internalCode}" ya existe, no se vuelve a crear.`);
                stockOnly++;

            } else {

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
                    console.log(`✅ Fila ${rowNumber}: (simulación) se crearía "${internalCode}" - ${name}`);
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
                    pvp: Number(pvp),
                    pvpCop: pvpCop !== undefined ? Number(pvpCop) : undefined,
                    minimumStock: Number(minimumStock)
                });

                productId = product.id;
                console.log(`✅ Fila ${rowNumber}: creado "${internalCode}" - ${name}`);
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

    console.log("\n====================================");
    console.log(`Productos nuevos: ${created}`);
    console.log(`Solo se agregó stock (ya existían): ${stockOnly}`);
    console.log(`Con error: ${failed}`);
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
