import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useAccountsReceivable } from "@/hooks";
import { getNextSequentialCode } from "@/lib";

const TERM_OPTIONS = [15, 30, 45, 60];

function VoucherList({
    name,
    label
}: {
    name: "transferVouchers" | "downPaymentVouchers";
    label: string;
}) {

    const { control, register, setValue, formState: { errors } } = useFormContext();

    const vouchers: string[] = useWatch({ control, name }) ?? [];

    const errorMessage =
        (errors[name] as { message?: string } | undefined)?.message;

    return (
        <div>
            <Label className="mb-1">{label}</Label>

            <div className="space-y-2">
                {vouchers.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            {...register(`${name}.${index}` as const)}
                            placeholder="Número de comprobante"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setValue(
                                name,
                                vouchers.filter((_, i) => i !== index)
                            )}
                        >
                            <Trash2 size={16} className="text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setValue(name, [...vouchers, ""])}
            >
                <Plus size={16} />
                Agregar comprobante
            </Button>

            <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
    );

}

export function SalePaymentSection() {

    const { control, register, setValue, formState: { errors } } = useFormContext();

    const paymentMethod = useWatch({ control, name: "paymentMethod" });
    const downPayment = Number(useWatch({ control, name: "downPayment" }) ?? 0);
    const downPaymentMethod = useWatch({ control, name: "downPaymentMethod" });

    const { data: accountsReceivableData } = useAccountsReceivable();

    useEffect(() => {

        if (paymentMethod !== "CREDIT") {
            return;
        }

        const list = accountsReceivableData?.data ?? [];

        if (list.length === 0) {
            setValue("accountReceivableNumber", "CTA-001");
            return;
        }

        const [last] = [...list].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const next = getNextSequentialCode(last.number);
        setValue("accountReceivableNumber", next || "CTA-001");

        // Solo se sugiere una vez, al cambiar a "Crédito" — la persona puede editarlo después.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod]);

    return (
        <div className="space-y-4 rounded-lg border p-3">

            <div>
                <Label className="mb-1">Forma de pago</Label>
                <Controller
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CASH">Efectivo</SelectItem>
                                <SelectItem value="TRANSFER">Transferencia</SelectItem>
                                <SelectItem value="CREDIT">Crédito</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.paymentMethod?.message as string}
                </p>
            </div>

            {paymentMethod === "TRANSFER" && (
                <VoucherList name="transferVouchers" label="Números de comprobante" />
            )}

            {paymentMethod === "CREDIT" && (
                <div className="space-y-4">

                    <div>
                        <Label className="mb-1">Número de cuenta de cobro</Label>
                        <Input {...register("accountReceivableNumber")} />
                        <p className="text-sm text-red-500">
                            {errors.accountReceivableNumber?.message as string}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>
                            <Label className="mb-1">Abono (opcional)</Label>
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                placeholder="0"
                                {...register("downPayment", {
                                    setValueAs: (v) => (v === "" ? undefined : Number(v))
                                })}
                            />
                        </div>

                        <div>
                            <Label className="mb-1">Plazo</Label>
                            <Controller
                                control={control}
                                name="termDays"
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sin plazo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TERM_OPTIONS.map(days => (
                                                <SelectItem key={days} value={String(days)}>
                                                    {days} días
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                    </div>

                    {downPayment > 0 && (
                        <div>
                            <Label className="mb-1">¿Cómo se pagó el abono?</Label>
                            <Controller
                                control={control}
                                name="downPaymentMethod"
                                render={({ field }) => (
                                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CASH">Efectivo</SelectItem>
                                            <SelectItem value="TRANSFER">Transferencia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <p className="text-sm text-red-500">
                                {errors.downPaymentMethod?.message as string}
                            </p>
                        </div>
                    )}

                    {downPayment > 0 && downPaymentMethod === "TRANSFER" && (
                        <VoucherList name="downPaymentVouchers" label="Números de comprobante del abono" />
                    )}

                    <p className="text-xs text-muted-foreground">
                        La cuenta de cobro se registrará por el saldo pendiente ({"total de la venta - abono"}).
                    </p>

                </div>
            )}

        </div>
    );

}
