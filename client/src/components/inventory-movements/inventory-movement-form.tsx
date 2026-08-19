import { Controller, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { inventoryMovementSchema } from "@/validators";
import type { InventoryMovementFormData } from "@/validators";
import { MinimumStockField } from "@/components/shared";
import {
    useMovementTypes,
    useProducts,
    useStores,
    useUsers,
    useCreateInventoryMovement,
    useUpdateInventoryMovement,
    useUpdateProductMinimumStock
} from "@/hooks";
import { toast } from "react-hot-toast";
import { matchProductByBarcode } from "@/lib";
import type { InventoryMovement } from "@/types";

type Props = {
    movement?: InventoryMovement | null;
    onSuccess?: () => void;
};

function toFormData(movement: InventoryMovement): InventoryMovementFormData {
    return {
        movementTypeId: movement.movementType.id,
        productId: movement.product.id,
        storeId: movement.store.id,
        quantity: Number(movement.quantity),
        unitCost: Number(movement.unitCost),
        observations: movement.observations ?? ""
    };
}

export function InventoryMovementForm({ movement, onSuccess }: Props) {

    const isEditing = !!movement;

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(inventoryMovementSchema),
        defaultValues: movement ? toFormData(movement) : {
            movementTypeId: "",
            productId: "",
            storeId: "",
            quantity: undefined,
            unitCost: undefined,
            observations: ""
        }
    });

    const { data: movementTypesData } = useMovementTypes();
    const { data: productsData } = useProducts();
    const { data: storesData } = useStores();
    const { data: usersData } = useUsers();
    const createMutation = useCreateInventoryMovement();
    const updateMutation = useUpdateInventoryMovement();
    const updateMinimumStockMutation = useUpdateProductMinimumStock();
    const movementTypes = movementTypesData?.data ?? [];
    const products = productsData?.data ?? [];
    const stores = storesData?.data ?? [];
    const users = usersData?.data ?? [];
    const loading = createMutation.isPending || updateMutation.isPending;

    const productId = useWatch({ control, name: "productId" });
    const selectedProduct = products.find(product => product.id === productId);

    const onSubmit = (data: InventoryMovementFormData) => {

        const onError = () => {
            toast.error(
                isEditing
                    ? "No se pudo actualizar el movimiento."
                    : "No se pudo registrar el movimiento."
            );
        };

        if (isEditing) {

            updateMutation.mutate({
                id: movement.id,
                data: {
                    ...data,
                    userId: movement.user.id,
                    movementDate: new Date(movement.movementDate)
                }
            }, {
                onSuccess: () => {
                    toast.success("Movimiento actualizado.");
                    onSuccess?.();
                },
                onError
            });

            return;

        }

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
                toast.success("Movimiento guardado como borrador.");
                reset();
                onSuccess?.();
            },
            onError
        });

    }

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-5">

            <div>
                <Label className="mb-1">Tipo de movimiento</Label>
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
                <Label className="mb-1">Producto</Label>
                <Controller
                    control={control}
                    name="productId"
                    render={({ field }) => {

                        const items = products.map(product => ({
                            value: product.id,
                            label: `${product.internalCode} - ${product.name}`
                        }));

                        const selected = items.find(item => item.value === field.value) ?? null;

                        const handleSelect = (item: { value: string; label: string } | null) => {

                            field.onChange(item ? item.value : "");

                            if (!item) {
                                return;
                            }

                            const product = products.find(p => p.id === item.value);

                            if (product?.costPrice !== undefined && product?.costPrice !== null) {
                                setValue("unitCost", Number(product.costPrice));
                            }

                        };

                        return (
                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={handleSelect}
                                onInputValueChange={(text) => {
                                    const match = matchProductByBarcode(products, text);
                                    if (match) {
                                        handleSelect({ value: match.id, label: `${match.internalCode} - ${match.name}` });
                                    }
                                }}
                            >
                                <ComboboxInput placeholder="Buscar producto..." />
                                <ComboboxContent>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxContent>
                                <ComboboxEmpty>
                                    No se encontraron productos.
                                </ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                <p className="text-sm text-red-500">
                    {errors.productId?.message}
                </p>
            </div>

            {selectedProduct && (
                <MinimumStockField
                    currentValue={Number(selectedProduct.minimumStock)}
                    saving={updateMinimumStockMutation.isPending}
                    editElsewhereLabel="Para cambiarlo, edítalo desde la sección Productos."
                    onSave={(value) => {
                        updateMinimumStockMutation.mutate(
                            { id: selectedProduct.id, minimumStock: value },
                            {
                                onSuccess: () => toast.success("Stock mínimo actualizado."),
                                onError: () => toast.error("No se pudo actualizar el stock mínimo.")
                            }
                        );
                    }}
                />
            )}

            <div>
                <Label className="mb-1">Bodega</Label>
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
                <Label className="mb-1">Cantidad</Label>
                <Input type="number" placeholder="0" {...register("quantity", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v))
                })} />
                <p className="text-sm text-red-500">
                    {errors.quantity?.message}
                </p>
            </div>

            <div>
                <Label className="mb-1">Costo unitario</Label>
                <Input type="number" placeholder="0" {...register("unitCost", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v))
                })} />
                <p className="text-xs text-muted-foreground">
                    Se llena automáticamente con el costo del producto seleccionado; puedes ajustarlo si es necesario.
                </p>
                <p className="text-sm text-red-500">
                    {errors.unitCost?.message}
                </p>
            </div>

            <div>
                <Label className="mb-1">Observaciones</Label>
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
                            : isEditing ? "Guardar cambios" : "Guardar como borrador"
                    }
                </Button>
            </div>

        </form>
    );

}
