import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useNextAccountReceivableNumber } from "@/hooks";
import { VoucherListFromContext } from "./voucher-list";
import { PaymentMethodsInput } from "./payment-methods-input";

const TERM_OPTIONS = [15, 30, 45, 60];

type Props = {
    total: number;
};

export function SalePaymentSection({ total }: Props) {

    const { control, register, setValue, formState: { errors } } = useFormContext();

    const paymentMethod = useWatch({ control, name: "paymentMethod" });
    const downPayment = Number(useWatch({ control, name: "downPayment" }) ?? 0);

    const paymentMethods: { method: "CASH" | "TRANSFER" }[] =
        useWatch({ control, name: "paymentMethods" }) ?? [];
    const hasTransfer = paymentMethods.some(entry => entry.method === "TRANSFER");

    const downPaymentMethods: { method: "CASH" | "TRANSFER" }[] =
        useWatch({ control, name: "downPaymentMethods" }) ?? [];
    const hasDownPaymentTransfer = downPaymentMethods.some(entry => entry.method === "TRANSFER");

    // Sugerencia calculada en el servidor sobre TODAS las cuentas de cobro (no solo
    // las de la tienda del usuario), porque el número es único globalmente — si se
    // calculara con la lista filtrada por tienda, podía sugerir un número que ya
    // existe en otra tienda y el guardado fallaba con "el número ya existe".
    const { data: nextNumberData } = useNextAccountReceivableNumber(paymentMethod === "CREDIT");

    useEffect(() => {

        if (paymentMethod !== "CREDIT" || !nextNumberData?.data.number) {
            return;
        }

        setValue("accountReceivableNumber", nextNumberData.data.number);

        // Solo se sugiere una vez, al cambiar a "Crédito" — la persona puede editarlo después.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod, nextNumberData]);

    return (
        <div className="space-y-4 rounded-lg border p-3">

            <div>
                <Label className="mb-1">Forma de pago</Label>
                <Controller
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                if (value !== "CREDIT") {
                                    setValue("paymentMethods", [{ method: value, amount: total }]);
                                } else {
                                    // No aplica en una venta a crédito: si queda con datos de la
                                    // selección anterior (ej. amount: 0), la validación del monto
                                    // (> 0) bloquea el guardado aunque el campo ya no se muestre.
                                    setValue("paymentMethods", []);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione">
                                    {(value: string | null) => {
                                        if (value === "CASH") return "Efectivo";
                                        if (value === "TRANSFER") return "Transferencia";
                                        if (value === "CREDIT") return "Crédito";
                                        if (value === "MIXED") return "Mixto (varios métodos)";
                                        return "Seleccione";
                                    }}
                                </SelectValue>
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

            {paymentMethod !== "CREDIT" && (
                <PaymentMethodsInput
                    control={control}
                    register={register}
                    setValue={setValue}
                    name="paymentMethods"
                    totalAmount={total}
                    syncFieldName="paymentMethod"
                    errorMessage={errors.paymentMethods?.message as string}
                />
            )}

            {paymentMethod !== "CREDIT" && hasTransfer && (
                <VoucherListFromContext name="transferVouchers" label="Números de comprobante" />
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
                                            <SelectValue placeholder="Sin plazo">
                                                {(value: string | null) =>
                                                    value ? `${value} días` : "Sin plazo"
                                                }
                                            </SelectValue>
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
                        <PaymentMethodsInput
                            control={control}
                            register={register}
                            setValue={setValue}
                            name="downPaymentMethods"
                            totalAmount={downPayment}
                            errorMessage={errors.downPaymentMethods?.message as string}
                        />
                    )}

                    {downPayment > 0 && hasDownPaymentTransfer && (
                        <VoucherListFromContext name="downPaymentVouchers" label="Números de comprobante del abono" />
                    )}

                    <p className="text-xs text-muted-foreground">
                        La cuenta de cobro se registrará por el saldo pendiente ({"total de la venta - abono"}).
                    </p>

                </div>
            )}

        </div>
    );

}
