import { useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format-currency";
import { todayLocalDateString } from "@/lib";
import { useCreateAccountReceivablePayment } from "@/hooks";
import { PaymentMethodsInput, VoucherList } from "@/components/sales";
import type { AccountReceivable } from "@/types";

type FormValues = {
    amount: number;
    paymentMethods: { method: "CASH" | "TRANSFER"; amount: number }[];
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
            paymentMethods: [{ method: "CASH", amount: 0 }],
            paymentDate: todayLocalDateString(),
            vouchers: [],
            observations: ""
        }
    });

    const amount = Number(useWatch({ control, name: "amount" }) ?? 0);
    const paymentMethods: { method: "CASH" | "TRANSFER" }[] = useWatch({ control, name: "paymentMethods" }) ?? [];
    const hasTransfer = paymentMethods.some(entry => entry.method === "TRANSFER");

    const paymentMutation = useCreateAccountReceivablePayment();

    const pendingBalance = Number(accountReceivable.amount);

    const onSubmit = (data: FormValues) => {

        if (data.amount > pendingBalance) {
            toast.error(`El abono no puede ser mayor que el saldo pendiente (${formatCurrency(pendingBalance, accountReceivable.currency)}).`);
            return;
        }

        const sum = data.paymentMethods.reduce((total, entry) => total + entry.amount, 0);

        if (Math.abs(sum - data.amount) > 0.01) {
            toast.error(`La suma de los métodos de pago (${sum}) no coincide con el monto del abono (${data.amount}).`);
            return;
        }

        const hasTransferMethod = data.paymentMethods.some(entry => entry.method === "TRANSFER");

        paymentMutation.mutate({
            id: accountReceivable.id,
            data: {
                amount: data.amount,
                paymentMethods: data.paymentMethods,
                paymentDate: new Date(data.paymentDate),
                vouchers: hasTransferMethod ? data.vouchers : undefined,
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

            <PaymentMethodsInput
                control={control}
                register={register}
                setValue={setValue}
                name="paymentMethods"
                totalAmount={amount}
                currency={accountReceivable.currency}
                errorMessage={(errors.paymentMethods as { message?: string } | undefined)?.message}
            />

            {hasTransfer && (
                <VoucherList
                    control={control}
                    register={register}
                    setValue={setValue}
                    name="vouchers"
                    label="Números de comprobante"
                    errorMessage={(errors.vouchers as { message?: string } | undefined)?.message}
                />
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
