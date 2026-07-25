import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inventoryMovementSchema } from "@/validators";
import type { InventoryMovementFormData } from "@/validators";
import { useMovementTypes, useProducts, useStores, useUsers, useCreateInventoryMovement } from "@/hooks";
import { toast } from "react-hot-toast";

type Props = {
    onSuccess?: () => void;
};

export function InventoryMovementForm({ onSuccess }: Props) {

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(inventoryMovementSchema),
        defaultValues: {
            movementTypeId: "",
            productId: "",
            storeId: "",
            quantity: 0,
            unitCost: 0,
            observations: ""
        }
    });

    const { data: movementTypesData } = useMovementTypes();
    const { data: productsData } = useProducts();
    const { data: storesData } = useStores();
    const { data: usersData } = useUsers();

    const createMutation = useCreateInventoryMovement();

    const movementTypes = movementTypesData?.data ?? [];
    const products = productsData?.data ?? [];
    const stores = storesData?.data ?? [];
    const users = usersData?.data ?? [];
    const loading = createMutation.isPending;

    const onSubmit = (data: InventoryMovementFormData) => {

        if (users.length === 0) {
            toast.error("No existen usuarios registrados.");
            return;
        }
        createMutation.mutate({
            ...data,
            userId: users[0]!.id,
            movementDate: new Date()
        }, {
            onSuccess: () => {
                toast.success("Movimiento registrado.");
                reset();
                onSuccess?.();
            },
            onError: () => {
                toast.error("No se pudo registrar el movimiento.");
            }
        });

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
                <Label>Tipo de movimiento</Label>
                <Controller
                    control={control}
                    name="movementTypeId"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                {movementTypes.map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">{errors.movementTypeId?.message}</p>
            </div>

            <div>
                <Label>Producto</Label>
                <Controller
                    control={control}
                    name="productId"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.productId?.message}
                </p>
            </div>

            <div>
                <Label>Bodega</Label>
                <Controller

                    control={control}
                    name="storeId"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                {stores.map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.storeId?.message}
                </p>

            </div>

            <div>
                <Label>Cantidad</Label>
                <Input type="number" {...register("quantity")} />
                <p className="text-sm text-red-500">
                    {errors.quantity?.message}
                </p>
            </div>

            <div>
                <Label>Costo unitario</Label>
                <Input type="number" {...register("unitCost")} />
                <p className="text-sm text-red-500">
                    {errors.unitCost?.message}
                </p>
            </div>

            <div>
                <Label>Observaciones</Label>
                <Input {...register("observations")} />
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {
                        loading
                            ? "Guardando..."
                            : "Guardar"
                    }
                </Button>
            </div>

        </form>
    );

}