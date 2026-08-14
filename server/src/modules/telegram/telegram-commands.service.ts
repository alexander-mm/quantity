import type { Part, RawMaterial, Product } from "@prisma/client";
import { PartService } from "../part/part.service.js";
import { RawMaterialService } from "../raw-material/raw-material.service.js";
import { ProductService } from "../product/product.service.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";
import { escapeTelegramHtml } from "../../integrations/telegram/telegram.service.js";
import { buildLowStockMessage, buildMediumStockMessage } from "../../jobs/stock-alerts.job.js";

const partService = new PartService();
const rawMaterialService = new RawMaterialService();
const productService = new ProductService();
const inventoryStockService = new InventoryStockService();

const SEARCH_RESULT_LIMIT = 8;

const HELP_TEXT =
    "<b>Comandos disponibles</b>\n" +
    "/stock &lt;código o texto&gt; — consulta stock de una pieza, materia prima o producto\n" +
    "/bajo — piezas, materia prima y productos con stock bajo ahora mismo\n" +
    "/medio — lo mismo, con stock medio\n" +
    "/ayuda — este mensaje";

export async function handleCommand(rawText: string): Promise<string> {

    const text = (rawText ?? "").trim();
    const [commandRaw, ...rest] = text.split(/\s+/);
    // Los comandos en grupos a veces llegan como "/stock@NombreDelBot".
    const command = (commandRaw ?? "").toLowerCase().replace(/@\S+$/, "");
    const argument = rest.join(" ").trim();

    switch (command) {

        case "/start":
        case "/ayuda":
        case "/help":
            return HELP_TEXT;

        case "/stock":
            return handleStockQuery(argument);

        case "/bajo":
            return (await buildLowStockMessage())
                ?? "✅ No hay piezas, materia prima ni productos en stock bajo en este momento.";

        case "/medio":
            return (await buildMediumStockMessage())
                ?? "✅ No hay piezas, materia prima ni productos en stock medio en este momento.";

        default:
            return `No reconozco ese comando.\n\n${HELP_TEXT}`;

    }

}

async function handleStockQuery(query: string): Promise<string> {

    if (!query) {
        return "Usá /stock &lt;código o texto&gt;, por ejemplo: /stock PZ-054 o /stock tornillo";
    }

    const [part, rawMaterial, product] = await Promise.all([
        partService.findByCode(query),
        rawMaterialService.findByCode(query),
        productService.findByInternalCode(query)
    ]);

    if (part) {
        return formatPartOrRawMaterial("🔧 Pieza", part);
    }

    if (rawMaterial) {
        return formatPartOrRawMaterial("🧱 Materia prima", rawMaterial);
    }

    if (product) {
        return formatProductStock(product);
    }

    return searchByText(query);

}

function formatPartOrRawMaterial(label: string, item: Part | RawMaterial): string {

    return `<b>${label}</b>\n` +
        `${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}\n` +
        `Stock: ${item.quantity} (mín. ${item.minimumStock})`;

}

async function formatProductStock(product: Product): Promise<string> {

    const stock = await inventoryStockService.findByProduct(product.id.toString());
    const lines = stock
        .filter(item => Number(item.quantity) !== 0)
        .map(item => `• ${escapeTelegramHtml(item.store.name)}: ${item.quantity}`);

    const header = `<b>📦 Producto</b>\n${escapeTelegramHtml(product.internalCode)} - ${escapeTelegramHtml(product.name)}`;

    if (lines.length === 0) {
        return `${header}\nSin stock registrado en ninguna tienda (mín. ${product.minimumStock}).`;
    }

    return `${header}\n${lines.join("\n")}\n(mín. ${product.minimumStock})`;

}

async function searchByText(query: string): Promise<string> {

    const normalized = query.toLowerCase();

    const [parts, rawMaterials, products] = await Promise.all([
        partService.findAll(),
        rawMaterialService.findAll(),
        productService.findAll()
    ]);

    const matches: string[] = [];

    for (const item of parts) {
        if (item.name.toLowerCase().includes(normalized) || item.code.toLowerCase().includes(normalized)) {
            matches.push(`🔧 ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity}`);
        }
    }

    for (const item of rawMaterials) {
        if (item.name.toLowerCase().includes(normalized) || item.code.toLowerCase().includes(normalized)) {
            matches.push(`🧱 ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity}`);
        }
    }

    for (const item of products) {
        if (item.name.toLowerCase().includes(normalized) || item.internalCode.toLowerCase().includes(normalized)) {
            matches.push(`📦 ${escapeTelegramHtml(item.internalCode)} - ${escapeTelegramHtml(item.name)}`);
        }
    }

    if (matches.length === 0) {
        return `No encontré nada para "${escapeTelegramHtml(query)}".`;
    }

    const shown = matches.slice(0, SEARCH_RESULT_LIMIT);
    const remaining = matches.length - shown.length;
    const suffix = remaining > 0
        ? `\n\n… y ${remaining} más. Afiná la búsqueda para ver menos resultados.`
        : "";

    return `<b>Resultados para "${escapeTelegramHtml(query)}"</b>\n\n${shown.join("\n")}${suffix}\n\n` +
        "Escribí el código exacto de alguno para ver el detalle completo.";

}
