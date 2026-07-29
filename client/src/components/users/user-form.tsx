import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RoleSelector } from "@/components/selectors/role-selector";
import { StoreSelector } from "@/components/selectors/store-selector";
import { userSchema, updateUserSchema } from "@/validators";
import type { UserFormData } from "@/validators";
import { useRoles, useStores, useCreateUser, useUpdateUser, useUser } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    userId?: string;
};

export function UserForm({ onSuccess, mode = "create", userId }: Props) {

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(mode === "edit" ? updateUserSchema : userSchema),
        defaultValues: {
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            roleId: "",
            storeId: ""
        }
    });

    const { data: rolesData } = useRoles();
    const { data: storesData } = useStores();
    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const { data: userData } = useUser(mode === "edit" ? userId : undefined);

    const roles = rolesData?.data ?? [];
    const stores = storesData?.data ?? [];
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !userData?.data) {
            return;
        }

        reset({
            username: userData.data.username,
            password: "",
            firstName: userData.data.firstName,
            lastName: userData.data.lastName,
            email: userData.data.email ?? "",
            phone: userData.data.phone ?? "",
            roleId: userData.data.roleId,
            storeId: userData.data.storeId
        });

    }, [mode, userData, reset]);

    const onSubmit = (data: UserFormData) => {

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) &&
                error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar el usuario.";
            toast.error(message);
        };

        if (mode === "edit" && userId) {
            updateMutation.mutate({
                id: userId,
                data: {
                    username: data.username,
                    password: data.password || undefined,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email || undefined,
                    phone: data.phone || undefined,
                    roleId: Number(data.roleId),
                    storeId: Number(data.storeId)
                }
            }, {
                onSuccess: () => {
                    toast.success("Usuario actualizado correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate({
            username: data.username,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || undefined,
            phone: data.phone || undefined,
            roleId: Number(data.roleId),
            storeId: Number(data.storeId)
        }, {
            onSuccess: () => {
                toast.success("Usuario creado correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label>Nombre</Label>
                    <Input {...register("firstName")} />
                    <p className="text-sm text-red-500">{errors.firstName?.message}</p>
                </div>
                <div>
                    <Label>Apellido</Label>
                    <Input {...register("lastName")} />
                    <p className="text-sm text-red-500">{errors.lastName?.message}</p>
                </div>
            </div>

            <div>
                <Label>Usuario</Label>
                <Input {...register("username")} />
                <p className="text-sm text-red-500">{errors.username?.message}</p>
            </div>

            <div>
                <Label>{mode === "edit" ? "Contraseña (opcional)" : "Contraseña"}</Label>
                <Input type="password" {...register("password")} />
                <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label>Correo (opcional)</Label>
                    <Input {...register("email")} />
                    <p className="text-sm text-red-500">{errors.email?.message}</p>
                </div>
                <div>
                    <Label>Teléfono (opcional)</Label>
                    <Input {...register("phone")} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                    control={control}
                    name="roleId"
                    render={({ field }) => (
                        <RoleSelector
                            roles={roles}
                            value={field.value}
                            onChange={(value) => field.onChange(value ?? "")}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="storeId"
                    render={({ field }) => (
                        <StoreSelector
                            stores={stores}
                            value={field.value}
                            onChange={(value) => field.onChange(value ?? "")}
                        />
                    )}
                />
            </div>
            <p className="text-sm text-red-500">
                {errors.roleId?.message || errors.storeId?.message}
            </p>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
