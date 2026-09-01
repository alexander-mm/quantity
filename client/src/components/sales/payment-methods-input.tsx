import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format-currency";

type PaymentMethodRow = {
    method: "CASH" | "TRANSFER";
    amount: number;
};

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: any;
    name: string;
    totalAmount: number;
    currency?: "USD" | "COP";
    errorMessage?: string;
    // Campo escalar externo (ej. "paymentMethod") que se mantiene sincronizado
    // con estas filas: CASH/TRANSFER si hay una sola, MIXED si hay dos.
    syncFieldName?: string;
};

// Editor de uno o más métodos de pago con su monto. El caso común (un solo
// método) no requiere que la persona escriba el monto: se sincroniza solo con
// totalAmount. Al agregar un segundo método, ambos montos se vuelven editables
// y deben sumar totalAmount (la validación de esa suma vive en el schema zod).
export function PaymentMethodsInput({
    control,
    register,
    setValue,
    name,
    totalAmount,
    currency,
    errorMessage,
    syncFieldName
}: Props) {

    const rows: PaymentMethodRow[] = useWatch({ control, name }) ?? [];

    useEffect(() => {

        if (rows.length === 1 && Number(rows[0]?.amount) !== totalAmount) {
            setValue(`${name}.0.amount`, totalAmount);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows.length, totalAmount]);

    const usedMethods = new Set(rows.map(row => row.method));

    const syncScalar = (newRows: PaymentMethodRow[]) => {

        if (!syncFieldName || newRows.length === 0) {
            return;
        }

        setValue(syncFieldName, newRows.length > 1 ? "MIXED" : newRows[0].method);

    };

    const handleAdd = () => {

        const other: "CASH" | "TRANSFER" = usedMethods.has("CASH") ? "TRANSFER" : "CASH";
        const currentSum = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
        const remaining = Math.max(totalAmount - currentSum, 0);

        const newRows = [...rows, { method: other, amount: remaining }];
        setValue(name, newRows);
        syncScalar(newRows);

    };

    const handleRemove = (index: number) => {

        const newRows = rows.filter((_, i) => i !== index);
        setValue(name, newRows);
        syncScalar(newRows);

    };

    const sum = rows.reduce((total, row) => total + (Number(row.amount) || 0), 0);
    const mismatch = rows.length > 1 && Math.abs(sum - totalAmount) > 0.01;

    return (
        <div className="space-y-2">

            {rows.length > 1 && <Label className="mb-1">Métodos de pago</Label>}

            <div className="space-y-2">
                {rows.map((row, index) => (
                    <div key={index} className="flex items-center gap-2">

                        <Controller
                            control={control}
                            name={`${name}.${index}.method`}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        const newRows = rows.map((r, i) => i === index ? { ...r, method: value as "CASH" | "TRANSFER" } : r);
                                        syncScalar(newRows);
                                    }}
                                >
                                    <SelectTrigger className="w-44">
                                        <SelectValue placeholder="Seleccione">
                                            {(value: string | null) =>
                                                value === "TRANSFER" ? "Transferencia" : value === "CASH" ? "Efectivo" : "Seleccione"
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH" disabled={usedMethods.has("CASH") && row.method !== "CASH"}>
                                            Efectivo
                                        </SelectItem>
                                        <SelectItem value="TRANSFER" disabled={usedMethods.has("TRANSFER") && row.method !== "TRANSFER"}>
                                            Transferencia
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            disabled={rows.length === 1}
                            className="flex-1"
                            {...register(`${name}.${index}.amount`, {
                                setValueAs: (v: string) => (v === "" ? undefined : Number(v))
                            })}
                        />

                        {rows.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemove(index)}>
                                <Trash2 size={16} className="text-red-500" />
                            </Button>
                        )}

                    </div>
                ))}
            </div>

            {rows.length < 2 && (
                <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
                    <Plus size={16} />
                    Agregar otro método de pago
                </Button>
            )}

            {rows.length > 1 && (
                <p className={`text-xs ${mismatch ? "text-red-500" : "text-muted-foreground"}`}>
                    Asignado: {formatCurrency(sum, currency)} de {formatCurrency(totalAmount, currency)}
                </p>
            )}

            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        </div>
    );

}
