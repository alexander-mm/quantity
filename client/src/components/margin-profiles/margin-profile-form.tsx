import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { marginProfileSchema } from "@/validators";
import type { MarginProfileFormData } from "@/validators";
import { useCreateMarginProfile } from "@/hooks";

type Props = {
    onSuccess?: () => void;
};

export function MarginProfileForm({ onSuccess }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(marginProfileSchema),
        defaultValues: {
            name: "",
            percentage: 0,
            displayOrder: 1
        }
    });

    const createMutation = useCreateMarginProfile();
    const loading = createMutation.isPending;

    const onSubmit = (data: MarginProfileFormData) => {

        createMutation.mutate({
            name: data.name,
            percentage: data.percentage,
            displayOrder: data.displayOrder
        }, {
            onSuccess: () => {
                toast.success("Perfil de margen creado correctamente.");
                reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) &&
                    error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo crear el perfil de margen.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
                <Label>Nombre</Label>
                <Input placeholder="Ej: Precio 1" {...register("name")} />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
                <Label>Porcentaje de margen (%)</Label>
                <Input type="number" step="0.01" {...register("percentage")} />
                <p className="text-sm text-red-500">{errors.percentage?.message}</p>
            </div>

            <div>
                <Label>Orden de visualización</Label>
                <Input type="number" step="1" {...register("displayOrder")} />
                <p className="text-sm text-red-500">{errors.displayOrder?.message}</p>
            </div>

            <p className="text-sm text-muted-foreground">
                Nota: este perfil solo aplicará a productos creados o editados después de guardarlo.
            </p>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
