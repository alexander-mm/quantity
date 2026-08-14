import pdfMake, { type Content } from "pdfmake";
import type { ReportData, CurrencyTotal, StoreTotal, ProductTotal, StoreMoney } from "./report-data.service.js";

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
    return `${currency} ${value.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`.trim();
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

function formatRange(range: ReportData["range"]): string {
    return `${formatDate(range.from)} — ${formatDate(range.to)}`;
}

function formatDayLabel(dateKey: string): string {
    const date = new Date(`${dateKey}T00:00:00`);
    return date.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
}

function percentChange(previous: number, current: number): string {
    if (previous === 0) {
        return current === 0 ? "0%" : "+∞%";
    }
    return `${(((current - previous) / previous) * 100).toFixed(1)}%`;
}

function storeTotalsLine(totals: CurrencyTotal[]): string {
    if (totals.length === 0) {
        return "Sin ventas.";
    }
    return totals.map(item => formatMoney(item.total, item.currency)).join(" / ");
}

function generatePdf(docDefinition: DocDefinition): Promise<Buffer> {
    return pdfMake.createPdf(docDefinition).getBuffer();
}

const baseStyles = {
    header: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] as [number, number, number, number] },
    subheader: { fontSize: 10, color: "#666666", margin: [0, 0, 0, 16] as [number, number, number, number] },
    sectionTitle: { fontSize: 14, bold: true, margin: [0, 0, 0, 8] as [number, number, number, number] },
    sectionHeader: { fontSize: 12, bold: true, margin: [0, 8, 0, 4] as [number, number, number, number] },
    dayLabel: { fontSize: 10, bold: true, margin: [8, 6, 0, 2] as [number, number, number, number] },
    storeTotal: { fontSize: 10, bold: true, margin: [0, 0, 0, 16] as [number, number, number, number] }
};

function topProductsByCurrency(productTotals: ProductTotal[]): Content[] {

    const currencies = Array.from(new Set(productTotals.map(item => item.currency))).sort();

    if (currencies.length === 0) {
        return [
            { text: "Top productos", style: "sectionHeader" },
            { text: "Sin datos en este período.", margin: [0, 0, 0, 12] }
        ];
    }

    const content: Content[] = [];

    for (const currency of currencies) {

        const top = productTotals
            .filter(item => item.currency === currency)
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        content.push({ text: `Top 10 productos (${currency})`, style: "sectionHeader" });
        content.push({
            table: {
                widths: ["auto", "*", "auto", "auto"],
                body: [
                    ["Código", "Producto", "Cant.", "Total"],
                    ...top.map(item => [item.code, item.name, String(item.quantity), formatMoney(item.total, "")])
                ]
            },
            margin: [0, 0, 0, 12]
        });

    }

    return content;

}

// ============================
// 1. Reporte de Ventas
// ============================

function salesSection(data: ReportData): Content[] {

    const content: Content[] = [
        { text: "1. Reporte de Ventas", style: "sectionTitle" },
        { text: `Ventas confirmadas: ${data.salesCount}`, margin: [0, 0, 0, 12] }
    ];

    if (data.salesByStore.length === 0) {
        content.push({ text: "Sin ventas registradas en este período.", margin: [0, 0, 0, 12] });
    }

    for (const store of data.salesByStore) {

        content.push({ text: store.storeName, style: "sectionHeader" });

        for (const day of store.days) {

            content.push({ text: formatDayLabel(day.date), style: "dayLabel" });

            const currencies = Array.from(new Set(day.items.map(item => item.currency))).sort();

            for (const currency of currencies) {

                const items = day.items.filter(item => item.currency === currency);

                // Solo se etiqueta la moneda en el título si ese día tuvo más de una — si es
                // la única, ya se ve en la columna "Total" de cada fila, no hace falta repetir.
                if (currencies.length > 1) {
                    content.push({ text: currency, margin: [8, 2, 0, 2] as [number, number, number, number] });
                }

                const rows = items.map(item => [item.code, item.name, String(item.quantity), formatMoney(item.total, item.currency)]);

                content.push({
                    table: { widths: ["auto", "*", "auto", "auto"], body: [["Código", "Producto", "Cant.", "Total"], ...rows] },
                    margin: [8, 0, 0, 8]
                });

            }

        }

        content.push({ text: `Subtotal ${store.storeName}: ${storeTotalsLine(store.totalsByCurrency)}`, style: "storeTotal" });

    }

    content.push(...topProductsByCurrency(data.kpis.productTotals));

    content.push({ text: `Total general: ${storeTotalsLine(data.kpis.totalsByCurrency)}`, style: "storeTotal" });

    return content;

}

// ============================
// 2. Reporte de Dinero
// ============================

type MoneyMetrics = Pick<StoreMoney, "totalsByCurrency" | "cashByCurrency" | "creditByCurrency" | "pendingReceivablesByCurrency">;

function moneyMetricsTable(metrics: MoneyMetrics): Content {

    const rows: string[][] = [
        ...metrics.totalsByCurrency.map(item => ["Total ventas", item.currency, formatMoney(item.total, "")]),
        ...metrics.cashByCurrency.map(item => ["Efectivo", item.currency, formatMoney(item.total, "")]),
        ...metrics.creditByCurrency.map(item => ["Crédito", item.currency, formatMoney(item.total, "")]),
        ...metrics.pendingReceivablesByCurrency.map(item => ["Cartera pendiente", item.currency, formatMoney(item.total, "")])
    ];

    if (rows.length === 0) {
        return { text: "Sin datos en este período.", margin: [0, 0, 0, 12] };
    }

    return {
        table: { widths: ["*", "auto", "*"], body: [["Métrica", "Moneda", "Monto"], ...rows] },
        margin: [0, 0, 0, 12]
    };

}

function moneySection(data: ReportData): Content[] {

    const content: Content[] = [
        { text: "2. Reporte de Dinero", style: "sectionTitle", pageBreak: "before" }
    ];

    if (data.moneyByStore.length === 0) {
        content.push({ text: "Sin datos en este período.", margin: [0, 0, 0, 12] });
    }

    for (const store of data.moneyByStore) {
        content.push({ text: store.storeName, style: "sectionHeader" });
        content.push(moneyMetricsTable(store));
    }

    content.push({ text: "Consolidado (todas las tiendas)", style: "sectionHeader" });
    content.push(moneyMetricsTable({
        totalsByCurrency: data.kpis.totalsByCurrency,
        cashByCurrency: data.kpis.cashByCurrency,
        creditByCurrency: data.kpis.creditByCurrency,
        pendingReceivablesByCurrency: data.kpis.pendingReceivablesByCurrency
    }));

    return content;

}

// ============================
// 3. Comparación semanal (KPIs)
// ============================

function currencyComparisonTable(title: string, current: CurrencyTotal[], previous: CurrencyTotal[]): Content[] {

    const currencies = Array.from(new Set([...current.map(item => item.currency), ...previous.map(item => item.currency)])).sort();

    if (currencies.length === 0) {
        return [{ text: title, style: "sectionHeader" }, { text: "Sin datos.", margin: [0, 0, 0, 12] }];
    }

    const rows = currencies.map(currency => {
        const curr = current.find(item => item.currency === currency)?.total ?? 0;
        const prev = previous.find(item => item.currency === currency)?.total ?? 0;
        return [currency, formatMoney(prev, ""), formatMoney(curr, ""), percentChange(prev, curr)];
    });

    return [
        { text: title, style: "sectionHeader" },
        {
            table: { widths: ["*", "*", "*", "*"], body: [["Moneda", "Semana anterior", "Semana actual", "Variación"], ...rows] },
            margin: [0, 0, 0, 12]
        }
    ];

}

function storeComparisonTable(current: StoreTotal[], previous: StoreTotal[]): Content[] {

    const keys = Array.from(new Set([
        ...current.map(item => `${item.storeName}|${item.currency}`),
        ...previous.map(item => `${item.storeName}|${item.currency}`)
    ])).sort();

    if (keys.length === 0) {
        return [{ text: "Ventas por tienda", style: "sectionHeader" }, { text: "Sin datos.", margin: [0, 0, 0, 12] }];
    }

    const rows = keys.map(key => {
        const [storeName, currency] = key.split("|");
        const curr = current.find(item => item.storeName === storeName && item.currency === currency)?.total ?? 0;
        const prev = previous.find(item => item.storeName === storeName && item.currency === currency)?.total ?? 0;
        return [storeName, currency, formatMoney(prev, ""), formatMoney(curr, ""), percentChange(prev, curr)];
    });

    return [
        { text: "Ventas por tienda", style: "sectionHeader" },
        {
            table: { widths: ["*", "auto", "*", "*", "auto"], body: [["Tienda", "Moneda", "Semana anterior", "Semana actual", "Variación"], ...rows] },
            margin: [0, 0, 0, 12]
        }
    ];

}

function averageTicketComparisonTable(
    current: { currency: string; average: number }[],
    previous: { currency: string; average: number }[]
): Content[] {

    const currencies = Array.from(new Set([...current.map(item => item.currency), ...previous.map(item => item.currency)])).sort();

    if (currencies.length === 0) {
        return [{ text: "Ticket promedio", style: "sectionHeader" }, { text: "Sin datos.", margin: [0, 0, 0, 12] }];
    }

    const rows = currencies.map(currency => {
        const curr = current.find(item => item.currency === currency)?.average ?? 0;
        const prev = previous.find(item => item.currency === currency)?.average ?? 0;
        return [currency, formatMoney(prev, ""), formatMoney(curr, ""), percentChange(prev, curr)];
    });

    return [
        { text: "Ticket promedio", style: "sectionHeader" },
        {
            table: { widths: ["*", "*", "*", "*"], body: [["Moneda", "Semana anterior", "Semana actual", "Variación"], ...rows] },
            margin: [0, 0, 0, 12]
        }
    ];

}

function unitsSoldLine(current: number, previous: number): Content[] {
    return [
        { text: "Unidades vendidas", style: "sectionHeader" },
        { text: `${previous} → ${current} (${percentChange(previous, current)})`, margin: [0, 0, 0, 12] }
    ];
}

function topMoversSection(current: ProductTotal[], previous: ProductTotal[]): Content[] {

    // Clave por producto + moneda: comparar un cambio en USD contra uno en COP por su
    // magnitud numérica no tiene sentido (las cifras en COP son naturalmente mucho más
    // grandes), así que el ranking de "subió/bajó" se calcula por separado en cada moneda.
    const currentMap = new Map(current.map(item => [`${item.code}|${item.currency}`, item]));
    const previousMap = new Map(previous.map(item => [`${item.code}|${item.currency}`, item]));
    const keys = new Set([...currentMap.keys(), ...previousMap.keys()]);

    const diffs = Array.from(keys).map(key => {

        const curr = currentMap.get(key);
        const prev = previousMap.get(key);
        const currTotal = curr?.total ?? 0;
        const prevTotal = prev?.total ?? 0;

        return {
            code: curr?.code ?? prev?.code ?? key,
            name: curr?.name ?? prev?.name ?? key,
            currency: curr?.currency ?? prev?.currency ?? "",
            currTotal,
            prevTotal,
            diff: currTotal - prevTotal
        };

    });

    const currencies = Array.from(new Set(diffs.map(item => item.currency))).sort();

    const content: Content[] = [{ text: "Productos que más subieron y bajaron", style: "sectionHeader" }];

    if (currencies.length === 0) {
        content.push({ text: "Sin variaciones para comparar en este período.", margin: [0, 0, 0, 12] });
        return content;
    }

    for (const currency of currencies) {

        const currencyDiffs = diffs.filter(item => item.currency === currency);
        const gainers = currencyDiffs.filter(item => item.diff > 0).sort((a, b) => b.diff - a.diff).slice(0, 3);
        const losers = currencyDiffs.filter(item => item.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, 3);

        if (gainers.length === 0 && losers.length === 0) {
            continue;
        }

        content.push({ text: currency, bold: true, margin: [0, 6, 0, 2] as [number, number, number, number] });

        if (gainers.length > 0) {
            content.push({ text: "Subieron", margin: [8, 2, 0, 2] as [number, number, number, number] });
            content.push({
                table: {
                    widths: ["auto", "*", "*", "*"],
                    body: [
                        ["Código", "Producto", "Antes", "Ahora"],
                        ...gainers.map(item => [item.code, item.name, formatMoney(item.prevTotal, ""), formatMoney(item.currTotal, "")])
                    ]
                },
                margin: [8, 0, 0, 8]
            });
        }

        if (losers.length > 0) {
            content.push({ text: "Bajaron", margin: [8, 2, 0, 2] as [number, number, number, number] });
            content.push({
                table: {
                    widths: ["auto", "*", "*", "*"],
                    body: [
                        ["Código", "Producto", "Antes", "Ahora"],
                        ...losers.map(item => [item.code, item.name, formatMoney(item.prevTotal, ""), formatMoney(item.currTotal, "")])
                    ]
                },
                margin: [8, 0, 0, 8]
            });
        }

    }

    return content;

}

function comparisonSection(current: ReportData, previous: ReportData): Content[] {

    return [
        { text: "3. Comparación con la semana anterior", style: "sectionTitle", pageBreak: "before" },
        { text: `Semana actual: ${formatRange(current.range)}`, style: "subheader" },
        { text: `Semana anterior: ${formatRange(previous.range)}`, margin: [0, -12, 0, 16] },
        { text: `Ventas confirmadas: ${previous.salesCount} → ${current.salesCount}`, margin: [0, 0, 0, 12] },
        ...currencyComparisonTable("Ventas totales por moneda", current.kpis.totalsByCurrency, previous.kpis.totalsByCurrency),
        ...storeComparisonTable(current.kpis.totalsByStore, previous.kpis.totalsByStore),
        ...averageTicketComparisonTable(current.kpis.averageTicketByCurrency, previous.kpis.averageTicketByCurrency),
        ...unitsSoldLine(current.kpis.unitsSold, previous.kpis.unitsSold),
        ...currencyComparisonTable("Efectivo", current.kpis.cashByCurrency, previous.kpis.cashByCurrency),
        ...currencyComparisonTable("Crédito", current.kpis.creditByCurrency, previous.kpis.creditByCurrency),
        ...currencyComparisonTable("Cartera pendiente", current.kpis.pendingReceivablesByCurrency, previous.kpis.pendingReceivablesByCurrency),
        ...topMoversSection(current.kpis.productTotals, previous.kpis.productTotals)
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
