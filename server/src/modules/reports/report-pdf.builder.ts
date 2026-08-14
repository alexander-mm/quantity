import pdfMake, { type Content } from "pdfmake";
import type { ReportData, CurrencyTotal, StoreTotal } from "./report-data.service.js";

type DocDefinition = Parameters<typeof pdfMake.createPdf>[0];

const FONT_FAMILY = "Helvetica";

// No hay TTF embebido: usamos las 14 fuentes estándar de PDF (siempre disponibles, sin
// archivos que empaquetar). pdfkit las resuelve internamente por nombre, sin tocar el
// filesystem — por eso no se define un localAccessPolicy (bloquearía también estos nombres).
pdfMake.setFonts({
    [FONT_FAMILY]: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique"
    }
});

// Los nombres de fuente estándar arriba pasan por esta misma validación de "archivo local"
// aunque no sean rutas reales, así que se permite explícitamente. No se referencian imágenes
// ni archivos locales en ningún reporte, y las URLs externas quedan bloqueadas.
pdfMake.setLocalAccessPolicy(() => true);
pdfMake.setUrlAccessPolicy(() => false);

function formatMoney(value: number, currency: string): string {
    return `${currency} ${value.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

function formatRange(range: ReportData["range"]): string {
    return `${formatDate(range.from)} — ${formatDate(range.to)}`;
}

function currencyTotalsTable(title: string, totals: CurrencyTotal[]): Content[] {

    if (totals.length === 0) {
        return [{ text: title, style: "sectionHeader" }, { text: "Sin datos en este período.", margin: [0, 0, 0, 12] }];
    }

    return [
        { text: title, style: "sectionHeader" },
        {
            table: {
                widths: ["*", "*", "*"],
                body: [
                    ["Moneda", "Ventas", "Total"],
                    ...totals.map(item => [item.currency, String(item.count), formatMoney(item.total, item.currency)])
                ]
            },
            margin: [0, 0, 0, 12]
        }
    ];

}

function generatePdf(docDefinition: DocDefinition): Promise<Buffer> {
    return pdfMake.createPdf(docDefinition).getBuffer();
}

const baseStyles = {
    header: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] as [number, number, number, number] },
    subheader: { fontSize: 10, color: "#666666", margin: [0, 0, 0, 16] as [number, number, number, number] },
    sectionTitle: { fontSize: 14, bold: true, margin: [0, 0, 0, 8] as [number, number, number, number] },
    sectionHeader: { fontSize: 12, bold: true, margin: [0, 8, 0, 4] as [number, number, number, number] }
};

function salesSection(data: ReportData): Content[] {

    const storeRows = data.totalsByStore.map((item: StoreTotal) => [item.storeName, item.currency, formatMoney(item.total, item.currency)]);
    const productRows = data.topProducts.map(item => [item.code, item.name, String(item.quantity), formatMoney(item.total, "")]);

    return [
        { text: "1. Reporte de Ventas", style: "sectionTitle" },
        { text: `Ventas confirmadas: ${data.salesCount}`, margin: [0, 0, 0, 12] },
        ...currencyTotalsTable("Total por moneda", data.totalsByCurrency),
        { text: "Ventas por tienda", style: "sectionHeader" },
        storeRows.length > 0
            ? { table: { widths: ["*", "*", "*"], body: [["Tienda", "Moneda", "Total"], ...storeRows] }, margin: [0, 0, 0, 12] }
            : { text: "Sin datos en este período.", margin: [0, 0, 0, 12] },
        { text: "Top 10 productos", style: "sectionHeader" },
        productRows.length > 0
            ? { table: { widths: ["auto", "*", "auto", "auto"], body: [["Código", "Producto", "Cant.", "Total"], ...productRows] }, margin: [0, 0, 0, 12] }
            : { text: "Sin datos en este período.", margin: [0, 0, 0, 12] }
    ];

}

function moneySection(data: ReportData): Content[] {

    return [
        { text: "2. Reporte de Dinero", style: "sectionTitle", pageBreak: "before" },
        ...currencyTotalsTable("Total de ventas", data.totalsByCurrency),
        ...currencyTotalsTable("Ventas de contado", data.cashByCurrency),
        ...currencyTotalsTable("Ventas a crédito", data.creditByCurrency),
        ...currencyTotalsTable("Cuentas por cobrar pendientes (al corte)", data.pendingReceivablesByCurrency)
    ];

}

function comparisonSection(current: ReportData, previous: ReportData): Content[] {

    const currencies = new Set([
        ...current.totalsByCurrency.map(item => item.currency),
        ...previous.totalsByCurrency.map(item => item.currency)
    ]);

    const rows = Array.from(currencies).map(currency => {

        const currentTotal = current.totalsByCurrency.find(item => item.currency === currency)?.total ?? 0;
        const previousTotal = previous.totalsByCurrency.find(item => item.currency === currency)?.total ?? 0;
        const change = previousTotal === 0
            ? (currentTotal === 0 ? "0%" : "+∞%")
            : `${(((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)}%`;

        return [currency, formatMoney(previousTotal, ""), formatMoney(currentTotal, ""), change];

    });

    return [
        { text: "3. Comparación con la semana anterior", style: "sectionTitle", pageBreak: "before" },
        { text: `Semana actual: ${formatRange(current.range)}`, style: "subheader" },
        { text: `Semana anterior: ${formatRange(previous.range)}`, margin: [0, -12, 0, 16] },
        {
            table: {
                widths: ["*", "*", "*", "*"],
                body: [["Moneda", "Semana anterior", "Semana actual", "Variación"], ...rows]
            },
            margin: [0, 0, 0, 12]
        },
        { text: `Ventas confirmadas: ${previous.salesCount} → ${current.salesCount}`, margin: [0, 0, 0, 12] }
    ];

}

export async function buildWeeklyReportPdf(current: ReportData, previous: ReportData): Promise<Buffer> {

    const content: Content[] = [
        { text: "Reporte Semanal", style: "header" },
        { text: formatRange(current.range), style: "subheader" },
        ...salesSection(current),
        ...moneySection(current),
        ...comparisonSection(current, previous)
    ];

    return generatePdf({ content, styles: baseStyles, defaultStyle: { font: FONT_FAMILY, fontSize: 9 } });

}
