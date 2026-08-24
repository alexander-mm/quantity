import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components";

const SERIES_COLOR = "#0170B8";

type SalesTrendPoint = {
    date: string;
    count: number;
};

type DashboardSalesTrendChartProps = {
    data: SalesTrendPoint[];
};

function formatDayLabel(dateKey: string): string {
    const [, month, day] = dateKey.split("-");
    return `${day}/${month}`;
}

function SalesTrendTooltip({
    active,
    payload
}: {
    active?: boolean;
    payload?: { value: number; payload: SalesTrendPoint }[];
}) {

    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const point = payload[0].payload;

    return (
        <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
            <p className="font-semibold text-popover-foreground">
                {point.count} {point.count === 1 ? "venta" : "ventas"}
            </p>
            <p className="text-xs text-muted-foreground">
                {formatDayLabel(point.date)}
            </p>
        </div>
    );

}

export function DashboardSalesTrendChart({
    data
}: DashboardSalesTrendChartProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Ventas confirmadas
                </CardTitle>
                <CardDescription>
                    Últimos 7 días, todas las tiendas
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart
                        data={data}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke="var(--border)"
                        />

                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDayLabel}
                            tickLine={false}
                            axisLine={{ stroke: "var(--border)" }}
                            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={28}
                            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />

                        <Tooltip
                            content={<SalesTrendTooltip />}
                            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                        />

                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={SERIES_COLOR}
                            strokeWidth={2}
                            fill={SERIES_COLOR}
                            fillOpacity={0.1}
                            dot={{ r: 4, fill: SERIES_COLOR, stroke: "var(--card)", strokeWidth: 2 }}
                            activeDot={{ r: 5, fill: SERIES_COLOR, stroke: "var(--card)", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

}
