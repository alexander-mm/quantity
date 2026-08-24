import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storeSchema } from "@/validators";
import type { StoreFormData } from "@/validators";
import { useCreateStore, useUpdateStore, useStore } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    storeId?: string;
};

export function StoreForm({ onSuccess, mode = "create", storeId }: Props) {

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            code: "",
            name: "",
            type: "STORE" as const,
            address: "",
            city: "",
            phone: "",
            email: "",
            manager: ""
        }
    });

    const createMutation = useCreateStore();
    const updateMutation = useUpdateStore();
    const { data: storeData } = useStore(mode === "edit" ? storeId : undefined);
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !storeData?.data) {
            return;
        }

        reset({
            code: storeData.data.code,
            name: storeData.data.name,
            type: storeData.data.type,
            address: storeData.data.address ?? "",
            city: storeData.data.city ?? "",
            phone: storeData.data.phone ?? "",
            email: storeData.data.email ?? "",
            manager: storeData.data.manager ?? ""
        });

    }, [mode, storeData, reset]);

    const onSubmit = (data: StoreFormData) => {

        const payload = {
            code: data.code,
            name: data.name,
            type: data.type,
            address: data.address || undefined,
            city: data.city || undefined,
            phone: data.phone || undefined,
            email: data.email || undefined,
            manager: data.manager || undefined
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) &&
                error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar la tienda.";
            toast.error(message);
        };

        if (mode === "edit" && storeId) {
            updateMutation.mutate({ id: storeId, data: payload }, {
                onSuccess: () => {
                    toast.success("Tienda actualizada correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Tienda creada correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-5">

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <div>
                <Label className="mb-1">Tipo</Label>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue>
                                    {(value: string | null) =>
                                        value === "STORE" ? "Tienda" : "Bodega Principal"
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MAIN_WAREHOUSE">Bodega Principal</SelectItem>
                                <SelectItem value="STORE">Tienda</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">{errors.type?.message}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label className="mb-1">Dirección (opcional)</Label>
                    <Input {...register("address")} />
                </div>
                <div>
                    <Label className="mb-1">Ciudad (opcional)</Label>
                    <Input {...register("city")} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label className="mb-1">Teléfono (opcional)</Label>
                    <Input {...register("phone")} />
                </div>
                <div>
                    <Label className="mb-1">Correo (opcional)</Label>
                    <Input {...register("email")} />
                    <p className="text-sm text-red-500">{errors.email?.message}</p>
                </div>
            </div>

            <div>
                <Label className="mb-1">Responsable (opcional)</Label>
                <Input {...register("manager")} />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
