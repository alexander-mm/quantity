import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { roleSchema } from "@/validators";
import type { RoleFormData } from "@/validators";
import { useCreateRole, useUpdateRole, useRole } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    roleId?: string;
};

export function RoleForm({ onSuccess, mode = "create", roleId }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: { name: "", description: "" }
    });

    const createMutation = useCreateRole();
    const updateMutation = useUpdateRole();
    const { data: roleData } = useRole(mode === "edit" ? roleId : undefined);
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (mode !== "edit" || !roleData?.data) {
            return;
        }
        reset({
            name: roleData.data.name,
            description: roleData.data.description ?? ""
        });
    }, [mode, roleData, reset]);

    const onSubmit = (data: RoleFormData) => {

        const payload = {
            name: data.name,
            description: data.description || undefined
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar el rol.";
            toast.error(message);
        };

        if (mode === "edit" && roleId) {
            updateMutation.mutate({ id: roleId, data: payload }, {
                onSuccess: () => {
                    toast.success("Rol actualizado correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Rol creado correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <Label>Nombre</Label>
                <Input placeholder="Ej: Supervisor" {...register("name")} />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>
            <div>
                <Label>Descripción (opcional)</Label>
                <Input {...register("description")} />
                <p className="text-sm text-red-500">{errors.description?.message}</p>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>
        </form>
    );
}
