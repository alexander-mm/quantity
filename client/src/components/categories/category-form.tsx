import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { categorySchema } from "@/validators";
import type { CategoryFormData } from "@/validators";
import { useCreateCategory, useUpdateCategory, useCategory } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    categoryId?: string;
};

export function CategoryForm({ onSuccess, mode = "create", categoryId }: Props) {

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            stockMultiplier: 1.5
        }
    });

    const referenceMinimumStock = 10;
    const stockMultiplier = useWatch({ control, name: "stockMultiplier" });
    const mediumStockResult = referenceMinimumStock * (Number(stockMultiplier) || 0);

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const { data: categoryData } = useCategory(mode === "edit" ? categoryId : undefined);
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !categoryData?.data) {
            return;
        }

        reset({
            name: categoryData.data.name,
            description: categoryData.data.description ?? "",
            stockMultiplier: Number(categoryData.data.stockMultiplier)
        });

    }, [mode, categoryData, reset]);

    const onSubmit = (data: CategoryFormData) => {

        const payload = {
            name: data.name,
            description: data.description || undefined,
            stockMultiplier: Number(data.stockMultiplier) || undefined
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) &&
                error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar la categoría.";
            toast.error(message);
        };

        if (mode === "edit" && categoryId) {
            updateMutation.mutate({ id: categoryId, data: payload }, {
                onSuccess: () => {
                    toast.success("Categoría actualizada correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Categoría creada correctamente.");
                reset();
                onSuccess?.();
            },
            onError
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

            <div>
                <Label className="mb-1">Multiplicador de stock medio</Label>
                <Input
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="1.5"
                    {...register("stockMultiplier", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                <p className="text-xs text-muted-foreground">
                    Se multiplica por el stock mínimo de cada producto de esta categoría para calcular
                    el umbral de "stock medio". Súbelo para categorías con reposición más lenta (ej. importados).
                </p>
                <p className="text-sm text-red-500">{errors.stockMultiplier?.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg border p-3">

                <div>
                    <Label className="mb-1">Stock mínimo (registrado)</Label>
                    <Input type="number" value={referenceMinimumStock} disabled readOnly />
                    <p className="mt-1 text-xs text-muted-foreground">
                        Valor de referencia, solo visual — no se guarda.
                    </p>
                </div>

                <div>
                    <Label className="mb-1">Resultado (stock medio)</Label>
                    <Input type="number" value={mediumStockResult} disabled readOnly />
                    <p className="mt-1 text-xs text-muted-foreground">
                        Un producto de esta categoría con ese stock mínimo se marcaría "medio" hasta esta cantidad.
                    </p>
                </div>

            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
