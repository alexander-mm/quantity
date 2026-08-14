import { PartService } from "../modules/part/part.service.js";
import { RawMaterialService } from "../modules/raw-material/raw-material.service.js";
import { InventoryStockService } from "../modules/inventory-stock/inventory-stock.service.js";
import { TelegramService, escapeTelegramHtml } from "../integrations/telegram/telegram.service.js";

const partService = new PartService();
const rawMaterialService = new RawMaterialService();
const inventoryStockService = new InventoryStockService();
const telegramService = new TelegramService();

function formatSection(title: string, lines: string[]): string {

    if (lines.length === 0) {
        return "";
    }

    return `<b>${title}</b>\n${lines.join("\n")}\n\n`;

}

export async function buildLowStockMessage(): Promise<string | null> {

    const [parts, rawMaterials, stock] = await Promise.all([
        partService.findLowStock(),
        rawMaterialService.findLowStock(),
        inventoryStockService.findLowStock()
    ]);

    const partLines = parts.map(
        item => `• ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity} / mín. ${item.minimumStock}`
    );

    const rawMaterialLines = rawMaterials.map(
        item => `• ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity} / mín. ${item.minimumStock}`
    );

    const productLines = stock.map(
        item => `• ${escapeTelegramHtml(item.product.internalCode)} - ${escapeTelegramHtml(item.product.name)} (${escapeTelegramHtml(item.store.name)}): ${item.quantity} / mín. ${item.product.minimumStock}`
    );

    if (partLines.length === 0 && rawMaterialLines.length === 0 && productLines.length === 0) {
        return null;
    }

    const message =
        "🔴 <b>Stock bajo</b>\n\n" +
        formatSection("Piezas", partLines) +
        formatSection("Materia prima", rawMaterialLines) +
        formatSection("Productos", productLines);

    return message.trim();

}

export async function buildMediumStockMessage(): Promise<string | null> {

    const [parts, rawMaterials, stock] = await Promise.all([
        partService.findMediumStock(),
        rawMaterialService.findMediumStock(),
        inventoryStockService.findMediumStock()
    ]);

    const partLines = parts.map(
        item => `• ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity} / mín. ${item.minimumStock}`
    );

    const rawMaterialLines = rawMaterials.map(
        item => `• ${escapeTelegramHtml(item.code)} - ${escapeTelegramHtml(item.name)}: ${item.quantity} / mín. ${item.minimumStock}`
    );

    const productLines = stock.map(
        item => `• ${escapeTelegramHtml(item.product.internalCode)} - ${escapeTelegramHtml(item.product.name)} (${escapeTelegramHtml(item.store.name)}): ${item.quantity} / mín. ${item.product.minimumStock}`
    );

    if (partLines.length === 0 && rawMaterialLines.length === 0 && productLines.length === 0) {
        return null;
    }

    const message =
        "🟡 <b>Stock medio</b>\n\n" +
        formatSection("Piezas", partLines) +
        formatSection("Materia prima", rawMaterialLines) +
        formatSection("Productos", productLines);

    return message.trim();

}

export async function runLowStockAlert(): Promise<void> {

    try {

        const message = await buildLowStockMessage();

        if (message) {
            await telegramService.sendMessage(message);
        }

    } catch (error) {
        console.error("❌ Error generando la alerta de stock bajo:", error);
    }

}

export async function runMediumStockAlert(): Promise<void> {

    try {

        const message = await buildMediumStockMessage();

        if (message) {
            await telegramService.sendMessage(message);
        }

    } catch (error) {
        console.error("❌ Error generando la alerta de stock medio:", error);
    }

}
