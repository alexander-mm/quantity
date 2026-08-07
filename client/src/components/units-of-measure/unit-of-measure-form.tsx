import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { unitOfMeasureSchema } from "@/validators";
import type { UnitOfMeasureFormData } from "@/validators";
import { useCreateUnitOfMeasure } from "@/hooks";

type Props = {
    onSuccess?: () => void;
};

export function UnitOfMeasureForm({ onSuccess }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(unitOfMeasureSchema),
        defaultValues: {
            code: "",
            name: "",
            description: ""
        }
    });

    const createMutation = useCreateUnitOfMeasure();
    const loading = createMutation.isPending;

    const onSubmit = (data: UnitOfMeasureFormData) => {

        createMutation.mutate({
            code: data.code,
            name: data.name,
            description: data.description || undefined
        }, {
            onSuccess: () => {
                toast.success("Unidad de medida creada correctamente.");
                reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) &&
                    error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo crear la unidad de medida.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
                <Label className="mb-1">Código</Label>
                <Input {...register("code")} />
                <p className="text-sm text-red-500">{errors.code?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Nombre</Label>
                <Input {...register("name")} />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Descripción (opcional)</Label>
                <Input {...register("description")} />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
