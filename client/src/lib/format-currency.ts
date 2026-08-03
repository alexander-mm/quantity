export function formatCurrency(value: number | string, currency: "USD" | "COP" = "USD"): string {

    const amount = Number(value);

    if (currency === "COP") {
        return `$${amount.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
    }

    return `US$${amount.toFixed(2)}`;

}
