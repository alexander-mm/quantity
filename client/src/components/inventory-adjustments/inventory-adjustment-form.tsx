import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox";
import { StoreSelector } from "@/components/selectors/store-selector";
import { inventoryAdjustmentSchema } from "@/validators";
import type { InventoryAdjustmentFormData } from "@/validators";
import { useProducts, useStores, useCreateInventoryAdjustment } from "@/hooks";
import { useAuthStore } from "@/store";

type Props = {
    onSuccess?: () => void;
};

export function InventoryAdjustmentForm({ onSuccess }: Props) {

    const user = useAuthStore(state => state.user);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(inventoryAdjustmentSchema),
        defaultValues: {
            productId: "",
            storeId: user?.storeId ?? "",
            type: "IN" as const,
            quantity: 0,
            reason: ""
        }
    });

    const { data: productsData } = useProducts();
    const { data: storesData } = useStores();
    const createMutation = useCreateInventoryAdjustment();

    const products = productsData?.data ?? [];
    const stores = storesData?.data ?? [];
    const loading = createMutation.isPending;

    const onSubmit = (data: InventoryAdjustmentFormData) => {

        if (!user) {
            toast.error("Sesión inválida.");
            return;
        }

        createMutation.mutate({
            ...data,
            userId: user.id
        }, {
            onSuccess: () => {
                toast.success("Ajuste registrado.");
                reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) &&
                    error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo registrar el ajuste.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
                <Label>Producto</Label>
                <Controller
                    control={control}
                    name="productId"
                    render={({ field }) => {

                        const items = products.map(product => ({
                            value: product.id,
                            label: `${product.internalCode} - ${product.name}`
                        }));

                        const selected = items.find(item => item.value === field.value) ?? null;

                        return (
                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={(item) => field.onChange(item ? item.value : "")}
                            >
                                <ComboboxInput placeholder="Buscar producto..." />
                                <ComboboxContent>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxContent>
                                <ComboboxEmpty>No se encontraron productos.</ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                <p className="text-sm text-red-500">{errors.productId?.message}</p>
            </div>

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
            <p className="text-sm text-red-500">{errors.storeId?.message}</p>

            <div>
                <Label>Tipo de ajuste</Label>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IN">Ajuste positivo (sobrante)</SelectItem>
                                <SelectItem value="OUT">Ajuste negativo (faltante / dañado)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div>
                <Label>Cantidad</Label>
                <Input type="number" step="1" {...register("quantity")} />
                <p className="text-sm text-red-500">{errors.quantity?.message}</p>
            </div>

            <div>
                <Label>Motivo</Label>
                <Input placeholder="Ej: conteo físico, producto dañado..." {...register("reason")} />
                <p className="text-sm text-red-500">{errors.reason?.message}</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}