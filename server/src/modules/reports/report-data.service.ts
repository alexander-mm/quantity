import { prisma } from "../../database/prisma/prisma.js";

export interface ReportRange {
    from: Date;
    to: Date;
}

export interface CurrencyTotal {
    currency: string;
    total: number;
    count: number;
}

export interface StoreTotal {
    storeName: string;
    currency: string;
    total: number;
}

export interface ProductTotal {
    code: string;
    name: string;
    currency: string;
    quantity: number;
    total: number;
}

export interface SoldItemLine {
    code: string;
    name: string;
    quantity: number;
    total: number;
    currency: string;
}

export interface DaySales {
    date: string;
    items: SoldItemLine[];
}

export interface StoreSales {
    storeName: string;
    days: DaySales[];
    totalsByCurrency: CurrencyTotal[];
}

export interface StoreMoney {
    storeName: string;
    totalsByCurrency: CurrencyTotal[];
    cashByCurrency: CurrencyTotal[];
    creditByCurrency: CurrencyTotal[];
    pendingReceivablesByCurrency: CurrencyTotal[];
}

export interface Kpis {
    totalsByCurrency: CurrencyTotal[];
    totalsByStore: StoreTotal[];
    averageTicketByCurrency: { currency: string; average: number }[];
    unitsSold: number;
    cashByCurrency: CurrencyTotal[];
    creditByCurrency: CurrencyTotal[];
    pendingReceivablesByCurrency: CurrencyTotal[];
    productTotals: ProductTotal[];
}

export interface ReportData {
    range: ReportRange;
    salesCount: number;
    salesByStore: StoreSales[];
    moneyByStore: StoreMoney[];
    kpis: Kpis;
}

function addToCurrencyMap(map: Map<string, CurrencyTotal>, currency: string, amount: number): void {
    const entry = map.get(currency) ?? { currency, total: 0, count: 0 };
    entry.total += amount;
    entry.count += 1;
    map.set(currency, entry);
}

export class ReportDataService {

    async getReportData(range: ReportRange): Promise<ReportData> {

        const sales = await prisma.sale.findMany({
            where: {
                status: "CONFIRMED",
                saleDate: { gte: range.from, lte: range.to }
            },
            include: {
                store: true,
                accountReceivable: true,
                details: { include: { product: true } }
            },
            orderBy: [
                { storeId: "asc" },
                { saleDate: "asc" }
            ]
        });

        // Acumuladores globales (KPIs)
        const totalsByCurrencyMap = new Map<string, CurrencyTotal>();
        const totalsByStoreMap = new Map<string, StoreTotal>();
        const cashByCurrencyMap = new Map<string, CurrencyTotal>();
        const creditByCurrencyMap = new Map<string, CurrencyTotal>();
        const productMap = new Map<string, ProductTotal>();
        let unitsSold = 0;

        // Ventas por tienda -> día -> ítems
        const salesByStoreMap = new Map<string, Map<string, SoldItemLine[]>>();
        const storeCurrencyTotalsMap = new Map<string, Map<string, CurrencyTotal>>();

        // Dinero por tienda
        const storeMoneyMap = new Map<string, {
            totalsByCurrency: Map<string, CurrencyTotal>;
            cashByCurrency: Map<string, CurrencyTotal>;
            creditByCurrency: Map<string, CurrencyTotal>;
        }>();

        for (const sale of sales) {

            const storeName = sale.store.name;
            const currency = sale.currency;
            const total = Number(sale.total);
            const dateKey = sale.saleDate.toISOString().split("T")[0];
            const isCredit = sale.accountReceivable !== null;

            addToCurrencyMap(totalsByCurrencyMap, currency, total);
            addToCurrencyMap(isCredit ? creditByCurrencyMap : cashByCurrencyMap, currency, total);

            const storeKey = `${storeName}|${currency}`;
            const storeEntry = totalsByStoreMap.get(storeKey) ?? { storeName, currency, total: 0 };
            storeEntry.total += total;
            totalsByStoreMap.set(storeKey, storeEntry);

            if (!storeMoneyMap.has(storeName)) {
                storeMoneyMap.set(storeName, {
                    totalsByCurrency: new Map(),
                    cashByCurrency: new Map(),
                    creditByCurrency: new Map()
                });
            }
            const storeMoney = storeMoneyMap.get(storeName)!;
            addToCurrencyMap(storeMoney.totalsByCurrency, currency, total);
            addToCurrencyMap(isCredit ? storeMoney.creditByCurrency : storeMoney.cashByCurrency, currency, total);

            if (!storeCurrencyTotalsMap.has(storeName)) {
                storeCurrencyTotalsMap.set(storeName, new Map());
            }
            addToCurrencyMap(storeCurrencyTotalsMap.get(storeName)!, currency, total);

            if (!salesByStoreMap.has(storeName)) {
                salesByStoreMap.set(storeName, new Map());
            }
            const dayMap = salesByStoreMap.get(storeName)!;
            if (!dayMap.has(dateKey)) {
                dayMap.set(dateKey, []);
            }
            const dayItems = dayMap.get(dateKey)!;

            for (const detail of sale.details) {

                const quantity = Number(detail.quantity);
                const lineTotal = Number(detail.lineTotal);
                unitsSold += quantity;

                dayItems.push({
                    code: detail.product.internalCode,
                    name: detail.product.name,
                    quantity,
                    total: lineTotal,
                    currency
                });

                // Clave por producto + moneda: sumar USD y COP como si fueran lo mismo no tiene sentido.
                const key = `${detail.product.internalCode}|${currency}`;
                const productEntry = productMap.get(key) ?? {
                    code: detail.product.internalCode,
                    name: detail.product.name,
                    currency,
                    quantity: 0,
                    total: 0
                };
                productEntry.quantity += quantity;
                productEntry.total += lineTotal;
                productMap.set(key, productEntry);

            }

        }

        const pendingReceivables = await prisma.accountReceivable.findMany({
            where: {
                isPaid: false,
                sale: { status: "CONFIRMED" }
            },
            include: {
                sale: { include: { store: true } }
            }
        });

        const pendingByCurrencyMap = new Map<string, CurrencyTotal>();
        const storePendingMap = new Map<string, Map<string, CurrencyTotal>>();

        for (const item of pendingReceivables) {

            addToCurrencyMap(pendingByCurrencyMap, item.currency, Number(item.amount));

            const storeName = item.sale.store.name;
            if (!storePendingMap.has(storeName)) {
                storePendingMap.set(storeName, new Map());
            }
            addToCurrencyMap(storePendingMap.get(storeName)!, item.currency, Number(item.amount));

        }

        const salesByStore: StoreSales[] = Array.from(salesByStoreMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([storeName, dayMap]) => ({
                storeName,
                days: Array.from(dayMap.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, items]) => ({ date, items })),
                totalsByCurrency: Array.from((storeCurrencyTotalsMap.get(storeName) ?? new Map()).values())
            }));

        const moneyStoreNames = new Set([...storeMoneyMap.keys(), ...storePendingMap.keys()]);

        const moneyByStore: StoreMoney[] = Array.from(moneyStoreNames)
            .sort((a, b) => a.localeCompare(b))
            .map(storeName => {

                const money = storeMoneyMap.get(storeName);

                return {
                    storeName,
                    totalsByCurrency: Array.from(money?.totalsByCurrency.values() ?? []),
                    cashByCurrency: Array.from(money?.cashByCurrency.values() ?? []),
                    creditByCurrency: Array.from(money?.creditByCurrency.values() ?? []),
                    pendingReceivablesByCurrency: Array.from((storePendingMap.get(storeName) ?? new Map()).values())
                };

            });

        const averageTicketByCurrency = Array.from(totalsByCurrencyMap.values()).map(entry => ({
            currency: entry.currency,
            average: entry.count > 0 ? entry.total / entry.count : 0
        }));

        const productTotals = Array.from(productMap.values()).sort((a, b) => b.total - a.total);

        return {
            range,
            salesCount: sales.length,
            salesByStore,
            moneyByStore,
            kpis: {
                totalsByCurrency: Array.from(totalsByCurrencyMap.values()),
                totalsByStore: Array.from(totalsByStoreMap.values()),
                averageTicketByCurrency,
                unitsSold,
                cashByCurrency: Array.from(cashByCurrencyMap.values()),
                creditByCurrency: Array.from(creditByCurrencyMap.values()),
                pendingReceivablesByCurrency: Array.from(pendingByCurrencyMap.values()),
                productTotals
            }
        };

    }

}
