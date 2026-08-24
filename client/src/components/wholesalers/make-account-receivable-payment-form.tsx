import { Controller, useForm, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { onFormError } from "@/lib/form-error-toast";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format-currency";
import { todayLocalDateString } from "@/lib";
import { useCreateAccountReceivablePayment } from "@/hooks";
import type { AccountReceivable } from "@/types";

type FormValues = {
    amount: number;
    paymentMethod: "CASH" | "TRANSFER";
    paymentDate: string;
    vouchers: string[];
    observations: string;
};

type Props = {
    accountReceivable: AccountReceivable;
    onSuccess?: () => void;
};

export function MakeAccountReceivablePaymentForm({ accountReceivable, onSuccess }: Props) {

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            amount: undefined,
            paymentMethod: "CASH",
            paymentDate: todayLocalDateString(),
            vouchers: [],
            observations: ""
        }
    });

    const paymentMethod = useWatch({ control, name: "paymentMethod" });
    const vouchers = useWatch({ control, name: "vouchers" }) ?? [];

    const paymentMutation = useCreateAccountReceivablePayment();

    const pendingBalance = Number(accountReceivable.amount);

    const onSubmit = (data: FormValues) => {

        if (data.amount > pendingBalance) {
            toast.error(`El abono no puede ser mayor que el saldo pendiente (${formatCurrency(pendingBalance, accountReceivable.currency)}).`);
            return;
        }

        paymentMutation.mutate({
            id: accountReceivable.id,
            data: {
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                paymentDate: new Date(data.paymentDate),
                vouchers: data.paymentMethod === "TRANSFER" ? data.vouchers : undefined,
                observations: data.observations || undefined
            }
        }, {
            onSuccess: () => {
                toast.success("Abono registrado correctamente.");
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo registrar el abono.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-5">

            <p className="text-sm text-muted-foreground">
                Saldo pendiente: <span className="font-medium text-foreground">{formatCurrency(pendingBalance, accountReceivable.currency)}</span>
            </p>

            <div>
                <Label className="mb-1">Monto del abono</Label>
                <Input
                    type="number"
                    min={0}
                    max={pendingBalance}
                    step="0.01"
                    placeholder="0"
                    {...register("amount", {
                        required: "El monto es obligatorio.",
                        min: { value: 0.01, message: "El monto debe ser mayor que cero." },
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                <p className="text-sm text-red-500">{errors.amount?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Fecha del abono</Label>
                <Input
                    type="date"
                    {...register("paymentDate", { required: "Seleccione la fecha." })}
                />
                <p className="text-sm text-red-500">{errors.paymentDate?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Forma de pago</Label>
                <Controller
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione">
                                    {(value: string | null) =>
                                        value === "TRANSFER" ? "Transferencia" : "Efectivo"
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CASH">Efectivo</SelectItem>
                                <SelectItem value="TRANSFER">Transferencia</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {paymentMethod === "TRANSFER" && (
                <div>
                    <Label className="mb-1">Números de comprobante</Label>

                    <div className="space-y-2">
                        {vouchers.map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    {...register(`vouchers.${index}` as const)}
                                    placeholder="Número de comprobante"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setValue(
                                        "vouchers",
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
                        onClick={() => setValue("vouchers", [...vouchers, ""])}
                    >
                        <Plus size={16} />
                        Agregar comprobante
                    </Button>

                    <p className="text-sm text-red-500">
                        {(errors.vouchers as { message?: string } | undefined)?.message}
                    </p>
                </div>
            )}

            <div>
                <Label className="mb-1">Observaciones (opcional)</Label>
                <Input {...register("observations")} />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={paymentMutation.isPending}>
                    {paymentMutation.isPending ? "Guardando..." : "Registrar abono"}
                </Button>
            </div>

        </form>
    );

}
