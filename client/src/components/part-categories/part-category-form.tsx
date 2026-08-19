import { useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { partCategorySchema } from "@/validators";
import type { PartCategoryFormData } from "@/validators";
import { useCreatePartCategory } from "@/hooks";

type Props = {
    onSuccess?: () => void;
};

export function PartCategoryForm({ onSuccess }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(partCategorySchema),
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const createMutation = useCreatePartCategory();
    const loading = createMutation.isPending;

    const onSubmit = (data: PartCategoryFormData) => {

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
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-5">

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
