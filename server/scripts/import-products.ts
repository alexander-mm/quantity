import "dotenv/config";
import XLSX from "xlsx";
import { prisma } from "../src/database/prisma/prisma.js";
import { ProductService } from "../src/modules/product/product.service.js";
import { CategoryRepository } from "../src/modules/category/category.repository.js";
import { MarginProfileRepository } from "../src/modules/margin-profile/margin-profile.repository.js";

interface ExcelRow {
    "Código Interno"?: string;
    "Nombre"?: string;
    "Marca"?: string;
    "Categoría"?: string;
    "Unidad de Medida"?: string;
    "Precio de Costo"?: number;
    "Stock Mínimo"?: number;
    "Código de Barras"?: string | number;
    "Descripción"?: string;
}

async function main() {

    const filePath = process.argv[2] ?? "scripts/products.xlsx";

    console.log(`Leyendo archivo: ${filePath}`);

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    console.log(`Filas encontradas: ${rows.length}`);

    const productService = new ProductService();
    const categoryRepository = new CategoryRepository();
    const marginRepository = new MarginProfileRepository();

    const marginProfiles = await marginRepository.findAll();
    const marginProfileIds = marginProfiles.map(profile => profile.id);

    if (marginProfileIds.length === 0) {
        console.warn(
            "⚠️  No hay perfiles de margen activos. Los productos se crearán sin precios de venta."
        );
    }

    const categoryCache = new Map<string, bigint>();

    let created = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];
        const rowNumber = i + 2; // +2: fila 1 es el encabezado, y los índices empiezan en 0

        const internalCode = row["Código Interno"]?.toString().trim();
        const name = row["Nombre"]?.toString().trim();
        const brand = row["Marca"]?.toString().trim();
        const categoryName = row["Categoría"]?.toString().trim();
        const unitOfMeasure = row["Unidad de Medida"]?.toString().trim();
        const costPrice = row["Precio de Costo"];
        const minimumStock = row["Stock Mínimo"];
        const barcode = row["Código de Barras"]?.toString().trim();
        const description = row["Descripción"]?.toString().trim();

        if (
            !internalCode ||
            !name ||
            !brand ||
            !categoryName ||
            !unitOfMeasure ||
            costPrice === undefined ||
            minimumStock === undefined
        ) {
            console.error(
                `❌ Fila ${rowNumber}: faltan campos obligatorios. Se omite.`
            );
            failed++;
            continue;
        }

        try {

            let categoryId = categoryCache.get(categoryName);

            if (!categoryId) {

                let category = await categoryRepository.findByName(categoryName);

                if (!category) {
                    category = await categoryRepository.create({
                        name: categoryName
                    });
                    console.log(`   ↳ Categoría creada: ${categoryName}`);
                }

                categoryId = category.id;
                categoryCache.set(categoryName, categoryId);

            }

            await productService.create({
                internalCode,
                barcode: barcode || null,
                name,
                description: description || undefined,
                brand,
                categoryId,
                unitOfMeasure,
                marginProfileIds,
                costPrice: Number(costPrice),
                minimumStock: Number(minimumStock)
            });

            console.log(`✅ Fila ${rowNumber}: ${internalCode} - ${name}`);
            created++;

        } catch (error) {

            const message = error instanceof Error ? error.message : String(error);
            console.error(`❌ Fila ${rowNumber} (${internalCode}): ${message}`);
            failed++;

        }

    }

    console.log("");
    console.log("====================================");
    console.log(`Creados: ${created}`);
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
