import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format-currency";
import type { Product } from "@/types";
import { useAuth } from "@/hooks";
import { ROLES } from "@/constants/roles";

type Props = {
    products: Product[];
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    stockByProductId?: Record<string, string>;
};

export function ProductsTable({
    products,
    onView,
    onEdit,
    onDelete,
    stockByProductId

}: Props) {
    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;
    const showStock = !!stockByProductId;
    const [pvpCurrency, setPvpCurrency] = useState<"USD" | "COP">("USD");

    return (
        <EntityTable
            headers={[
                "Código",
                "Producto",
                "Marca",
                <Select
                    key="pvp-currency"
                    value={pvpCurrency}
                    onValueChange={(value) => setPvpCurrency(value as "USD" | "COP")}
                >
                    <SelectTrigger className="h-8 w-28 border-none bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">PVP (USD)</SelectItem>
                        <SelectItem value="COP">PVP (COP)</SelectItem>
                    </SelectContent>
                </Select>,
                ...(showStock ? ["Existencias"] : []),
                "Acciones"
            ]}
        >
            {
                products.map(product => (
                    <tr
                        key={product.id}
                        className="border-b transition hover:bg-muted/40"
                    >
                        <td className="px-6 py-4">
                            {product.internalCode}
                        </td>
                        <td className="px-6 py-4 font-medium">
                            {product.name}
                        </td>
                        <td className="px-6 py-4">
                            {product.brand.name}
                        </td>
                        <td className="px-6 py-4">
                            {
                                (() => {
                                    const value = pvpCurrency === "COP" ? product.pvpCop : product.pvp;
                                    return value ? formatCurrency(value, pvpCurrency) : "-";
                                })()
                            }
                        </td>
                        {showStock && (
                            <td className="px-6 py-4">
                                {stockByProductId?.[product.id] ?? "0"}
                            </td>
                        )}
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Eye
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                    onClick={() => onView(product)}
                                />
                                {isAdmin && (
                                    <>
                                        <Pencil
                                            size={18}
                                            className="cursor-pointer text-slate-500 hover:text-primary"
                                            onClick={() => onEdit(product)}
                                        />
                                        <Trash2
                                            size={18}
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                            onClick={() => onDelete(product)}
                                        />
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))
            }
        </EntityTable>
    );
}
