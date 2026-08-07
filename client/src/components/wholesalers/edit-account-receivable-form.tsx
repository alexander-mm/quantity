import { useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUpdateAccountReceivable } from "@/hooks";
import type { AccountReceivable } from "@/types";

type FormValues = {
    number: string;
    observations: string;
};

type Props = {
    accountReceivable: AccountReceivable;
    onSuccess?: () => void;
};

export function EditAccountReceivableForm({ accountReceivable, onSuccess }: Props) {

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            number: accountReceivable.number,
            observations: accountReceivable.observations ?? ""
        }
    });

    const updateMutation = useUpdateAccountReceivable();

    const onSubmit = (data: FormValues) => {

        updateMutation.mutate({
            id: accountReceivable.id,
            data: {
                number: data.number,
                observations: data.observations || undefined
            }
        }, {
            onSuccess: () => {
                toast.success("Cuenta de cobro actualizada correctamente.");
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo actualizar la cuenta de cobro.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-5">

            <div>
                <Label className="mb-1">N° cuenta de cobro</Label>
                <Input {...register("number", { required: "El número es obligatorio." })} />
                <p className="text-sm text-red-500">{errors.number?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Observaciones (opcional)</Label>
                <Input {...register("observations")} />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
