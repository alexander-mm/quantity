import { useFormContext } from "react-hook-form";
import { formatCurrency } from "@/lib/format-currency";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency?: "USD" | "COP";
};

export function QuoteTotals({ subtotal, discount, tax, total, currency = "USD" }: Props) {

    const { register, watch, formState: { errors } } = useFormContext();

    const hasShipping = watch("hasShipping");
    const hasAdditionalCost = watch("hasAdditionalCost");

    return (
        <div className="ml-auto w-full max-w-sm rounded-lg border p-4">

            <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal, currency)}</strong>
            </div>

            <div className="flex justify-between py-1">
                <span>Descuento</span>
                <strong>{formatCurrency(discount, currency)}</strong>
            </div>

            <div className="flex justify-between py-1">
                <span>IVA</span>
                <strong>{formatCurrency(tax, currency)}</strong>
            </div>

            <div className="border-t py-2">

                <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" {...register("hasShipping")} />
                    <span>Envío</span>
                </label>

                {hasShipping && (
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <Label className="shrink-0">Costo de envío</Label>
                        <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            className="max-w-[140px]"
                            {...register("shippingCost", {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            })}
                        />
                    </div>
                )}

                {hasShipping && errors.shippingCost && (
                    <p className="mt-1 text-right text-sm text-red-500">
                        {errors.shippingCost?.message as string}
                    </p>
                )}

                <label className="mt-2 flex cursor-pointer items-center gap-2">
                    <input type="checkbox" {...register("hasAdditionalCost")} />
                    <span>Costo adicional</span>
                </label>

                {hasAdditionalCost && (
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <Label className="shrink-0">Monto adicional</Label>
                        <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            className="max-w-[140px]"
                            {...register("additionalCost", {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            })}
                        />
                    </div>
                )}

                {hasAdditionalCost && errors.additionalCost && (
                    <p className="mt-1 text-right text-sm text-red-500">
                        {errors.additionalCost?.message as string}
                    </p>
                )}

            </div>

            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total, currency)}</span>
            </div>

        </div>
    );
}
