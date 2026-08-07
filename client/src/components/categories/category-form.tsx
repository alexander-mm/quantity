import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { categorySchema } from "@/validators";
import type { CategoryFormData } from "@/validators";
import { useCreateCategory } from "@/hooks";

type Props = {
    onSuccess?: () => void;
};

export function CategoryForm({ onSuccess }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const createMutation = useCreateCategory();
    const loading = createMutation.isPending;

    const onSubmit = (data: CategoryFormData) => {

        createMutation.mutate({
            name: data.name,
            description: data.description || undefined
        }, {
            onSuccess: () => {
                toast.success("Categoría creada correctamente.");
                reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) &&
                    error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo crear la categoría.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
