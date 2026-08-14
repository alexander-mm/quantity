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
    "/piezas &lt;código o texto&gt; — consulta solo piezas\n" +
    "/productos &lt;código o texto&gt; — consulta solo productos\n" +
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

        case "/piezas":
            return handlePartsQuery(argument);

        case "/productos":
            return handleProductsQuery(argument);

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

    const normalized = query.toLowerCase();

    const [parts, rawMaterials, products] = await Promise.all([
        partService.findAll(),
        rawMaterialService.findAll(),
        productService.findAll()
    ]);

    const matches = [
        ...parts.filter(item => matchesQuery(item.code, item.name, normalized)).map(item => partLine(item)),
        ...rawMaterials.filter(item => matchesQuery(item.code, item.name, normalized)).map(item => rawMaterialLine(item)),
        ...products.filter(item => matchesQuery(item.internalCode, item.name, normalized)).map(item => productLine(item))
    ];

    return formatResultsList("Resultados", query, matches, "nada");

}

async function handlePartsQuery(query: string): Promise<string> {

    if (!query) {
        return "Usá /piezas &lt;código o texto&gt;, por ejemplo: /piezas PZ-054 o /piezas tornillo";
    }

    const exact = await partService.findByCode(query);

    if (exact) {
        return formatPartOrRawMaterial("🔧 Pieza", exact);
    }

    const normalized = query.toLowerCase();
    const parts = await partService.findAll();
    const matches = parts
        .filter(item => matchesQuery(item.code, item.name, normalized))
        .map(item => partLine(item));

    return formatResultsList("Piezas", query, matches, "piezas");

}

async function handleProductsQuery(query: string): Promise<string> {

    if (!query) {
        return "Usá /productos &lt;código o texto&gt;, por ejemplo: /productos INT-001 o /productos tornillo";
    }

    const exact = await productService.findByInternalCode(query);

    if (exact) {
        return formatProductStock(exact);
    }

    const normalized = query.toLowerCase();
    const products = await productService.findAll();
    const matches = products
        .filter(item => matchesQuery(item.internalCode, item.name, normalized))
        .map(item => productLine(item));

    return formatResultsList("Productos", query, matches, "productos")
        + (matches.length > 0 ? "\n\nEscribí el código exacto de alguno para ver el stock por tienda." : "");

}

function matchesQuery(code: string, name: string, normalizedQuery: string): boolean {
    return name.toLowerCase().includes(normalizedQuery) || code.toLowerCase().includes(normalizedQuery);
}

function partLine(item: Part): string {
    return `🔧 ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity}`;
}

function rawMaterialLine(item: RawMaterial): string {
    return `🧱 ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity}`;
}

function productLine(item: Product): string {
    return `📦 ${escapeTelegramHtml(item.internalCode)} - ${escapeTelegramHtml(item.name)}`;
}

function formatResultsList(title: string, query: string, lines: string[], notFoundLabel: string): string {

    if (lines.length === 0) {
        return `No encontré ${notFoundLabel} para "${escapeTelegramHtml(query)}".`;
    }

    const shown = lines.slice(0, SEARCH_RESULT_LIMIT);
    const remaining = lines.length - shown.length;
    const suffix = remaining > 0
        ? `\n\n… y ${remaining} más. Afiná la búsqueda para ver menos resultados.`
        : "";

    return `<b>${title} para "${escapeTelegramHtml(query)}"</b>\n\n${shown.join("\n")}${suffix}`;

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
