import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components";

const SERIES_COLOR = "#0170B8";

type StockByStorePoint = {
    storeId: string;
    storeName: string;
    quantity: number;
};

type DashboardStockByStoreChartProps = {
    data: StockByStorePoint[];
};

function StockByStoreTooltip({
    active,
    payload
}: {
    active?: boolean;
    payload?: { value: number; payload: StockByStorePoint }[];
}) {

    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const point = payload[0].payload;

    return (
        <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
            <p className="font-semibold text-popover-foreground">
                {point.quantity.toLocaleString("es-CO")} unidades
            </p>
            <p className="text-xs text-muted-foreground">
                {point.storeName}
            </p>
        </div>
    );

}

export function DashboardStockByStoreChart({
    data
}: DashboardStockByStoreChartProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Stock por tienda
                </CardTitle>
                <CardDescription>
                    Existencias totales actuales
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={data}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke="var(--border)"
                        />

                        <XAxis
                            dataKey="storeName"
                            tickLine={false}
                            axisLine={{ stroke: "var(--border)" }}
                            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={56}
                            tickFormatter={(value: number) => value.toLocaleString("es-CO")}
                            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />

                        <Tooltip
                            content={<StockByStoreTooltip />}
                            cursor={{ fill: "var(--muted)" }}
                        />

                        <Bar
                            dataKey="quantity"
                            fill={SERIES_COLOR}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={24}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

}
