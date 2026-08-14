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
    quantity: number;
    total: number;
}

export interface ReportData {
    range: ReportRange;
    salesCount: number;
    totalsByCurrency: CurrencyTotal[];
    totalsByStore: StoreTotal[];
    cashByCurrency: CurrencyTotal[];
    creditByCurrency: CurrencyTotal[];
    topProducts: ProductTotal[];
    pendingReceivablesByCurrency: CurrencyTotal[];
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
            }
        });

        const totalsByCurrencyMap = new Map<string, CurrencyTotal>();
        const totalsByStoreMap = new Map<string, StoreTotal>();
        const cashByCurrencyMap = new Map<string, CurrencyTotal>();
        const creditByCurrencyMap = new Map<string, CurrencyTotal>();
        const productMap = new Map<string, ProductTotal>();

        for (const sale of sales) {

            const currency = sale.currency;
            const total = Number(sale.total);

            const currencyEntry = totalsByCurrencyMap.get(currency) ?? { currency, total: 0, count: 0 };
            currencyEntry.total += total;
            currencyEntry.count += 1;
            totalsByCurrencyMap.set(currency, currencyEntry);

            const storeKey = `${sale.store.name}|${currency}`;
            const storeEntry = totalsByStoreMap.get(storeKey) ?? { storeName: sale.store.name, currency, total: 0 };
            storeEntry.total += total;
            totalsByStoreMap.set(storeKey, storeEntry);

            const bucketMap = sale.accountReceivable !== null ? creditByCurrencyMap : cashByCurrencyMap;
            const bucketEntry = bucketMap.get(currency) ?? { currency, total: 0, count: 0 };
            bucketEntry.total += total;
            bucketEntry.count += 1;
            bucketMap.set(currency, bucketEntry);

            for (const detail of sale.details) {

                const key = detail.product.internalCode;
                const productEntry = productMap.get(key) ?? {
                    code: detail.product.internalCode,
                    name: detail.product.name,
                    quantity: 0,
                    total: 0
                };
                productEntry.quantity += Number(detail.quantity);
                productEntry.total += Number(detail.lineTotal);
                productMap.set(key, productEntry);

            }

        }

        const pendingReceivables = await prisma.accountReceivable.findMany({
            where: {
                isPaid: false,
                sale: { status: "CONFIRMED" }
            }
        });

        const pendingByCurrencyMap = new Map<string, CurrencyTotal>();

        for (const item of pendingReceivables) {

            const entry = pendingByCurrencyMap.get(item.currency) ?? { currency: item.currency, total: 0, count: 0 };
            entry.total += Number(item.amount);
            entry.count += 1;
            pendingByCurrencyMap.set(item.currency, entry);

        }

        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        return {
            range,
            salesCount: sales.length,
            totalsByCurrency: Array.from(totalsByCurrencyMap.values()),
            totalsByStore: Array.from(totalsByStoreMap.values()),
            cashByCurrency: Array.from(cashByCurrencyMap.values()),
            creditByCurrency: Array.from(creditByCurrencyMap.values()),
            topProducts,
            pendingReceivablesByCurrency: Array.from(pendingByCurrencyMap.values())
        };

    }

}
