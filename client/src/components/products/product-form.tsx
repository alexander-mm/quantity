import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productSchema } from "@/validators";
import type { ProductFormData } from "@/validators";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories, useMarginProfiles, useCreateProduct, useUpdateProduct, useProduct } from "@/hooks";
import { toast } from "react-hot-toast";

type ProductFormProps = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    productId?: string;
};

export function ProductForm({

    onSuccess,
    mode = "create",
    productId
}: ProductFormProps) {

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {
            errors
        }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            internalCode: "",
            barcode: "",
            name: "",
            description: "",
            brand: "",
            categoryId: "",
            unitOfMeasure: "",
            marginProfileIds: [],
            costPrice: 0,
            pvp: 0,
            pvpCop: 0,
            minimumStock: 0
        }
    });

    const { data: categoriesData } = useCategories();
    const { data: marginsData } = useMarginProfiles();
    const createProductMutation = useCreateProduct();
    const { data: productData } = useProduct(
        mode === "edit"
            ? productId
            : undefined
    );
    const updateProductMutation = useUpdateProduct();
    const categories = categoriesData?.data ?? [];
    const margins = marginsData?.data ?? [];
    useEffect(() => {

        if (
            mode !== "edit" ||
            !productData?.data
        ) {
            return;
        }

        reset({

            internalCode: productData.data.internalCode,
            barcode: productData.data.barcode ?? "",
            name: productData.data.name,
            description: productData.data.description ?? "",
            brand: productData.data.brand,
            categoryId: productData.data.categoryId,
            unitOfMeasure: productData.data.unitOfMeasure,
            marginProfileIds: productData.data.marginProfileIds,
            costPrice: Number(productData.data.costPrice),
            pvp: Number(productData.data.pvp),
            pvpCop: productData.data.pvpCop ? Number(productData.data.pvpCop) : 0,
            minimumStock: Number(productData.data.minimumStock)
        });
    }, [
        mode,
        productData,
        reset
    ]);

    async function onSubmit(data: ProductFormData) {

        const payload = {
            ...data,
            costPrice: Number(data.costPrice),
            pvp: Number(data.pvp),
            pvpCop: Number(data.pvpCop) || undefined,
            minimumStock: Number(data.minimumStock)
        };

        if (mode === "create") {
            createProductMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Producto creado correctamente.");
                    reset();
                    onSuccess?.();
                },
                onError: (error) => {
                    console.error(error);
                    toast.error("No se pudo crear el producto.");
                }
            });
            return;
        }

        if (!productId) {

            toast.error("No se encontró el producto.");
            return;
        }
        updateProductMutation.mutate({
            id: productId,
            data: payload
        }, {
            onSuccess: () => {
                toast.success("Producto actualizado correctamente.");
                reset();
                onSuccess?.();
            },
            onError: (error) => {
                console.error(error);
                toast.error("No se pudo actualizar el producto.");
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 h-full"
        >
            <div>
                <Label>
                    Código interno
                </Label>
                <Input
                    {...register("internalCode")}
                />
                <p className="text-sm text-red-500">
                    {errors.internalCode?.message}
                </p>
            </div>
            <div>
                <Label>
                    Código de barras
                </Label>
                <Input
                    {...register("barcode")}
                />
            </div>

            <div>
                <Label>
                    Nombre
                </Label>
                <Input
                    {...register("name")}
                />
                <p className="text-sm text-red-500">
                    {errors.name?.message}
                </p>
            </div>

            <div>
                <Label>
                    Descripción
                </Label>
                <Input
                    {...register("description")}
                />
            </div>

            <div>
                <Label>
                    Marca
                </Label>

                <Input
                    {...register("brand")}
                    placeholder="Ingrese la marca"
                />

                <p className="text-sm text-red-500">
                    {errors.brand?.message}
                </p>
            </div>

            <div>
                <Label>
                    Categoría
                </Label>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (

                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.categoryId?.message}
                </p>
            </div>

            <div>
                <Label>
                    Unidad de medida
                </Label>

                <Input
                    {...register("unitOfMeasure")}
                    placeholder="Ej. Unidad, Caja, Metro..."
                />

                <p className="text-sm text-red-500">
                    {errors.unitOfMeasure?.message}
                </p>
            </div>

            <div>

                <Label>
                    Perfiles de precio
                </Label>

                <Controller
                    control={control}
                    name="marginProfileIds"
                    render={({ field }) => (

                        <div className="space-y-2">

                            {margins.map(profile => (

                                <label
                                    key={profile.id}
                                    className="flex items-center gap-2"
                                >

                                    <input
                                        type="checkbox"
                                        value={profile.id}
                                        checked={field.value.includes(profile.id)}
                                        onChange={(e) => {

                                            if (e.target.checked) {

                                                field.onChange([
                                                    ...field.value,
                                                    profile.id
                                                ]);

                                            } else {

                                                field.onChange(

                                                    field.value.filter(
                                                        id => id !== profile.id
                                                    )

                                                );

                                            }

                                        }}
                                    />

                                    {profile.name} (-{Number(profile.percentage)}%)

                                </label>

                            ))}

                        </div>

                    )}
                />

                <p className="text-sm text-red-500">

                    {errors.marginProfileIds?.message}

                </p>

            </div>

            <div>
                <Label>
                    Costo
                </Label>
                <Input
                    type="number"
                    {...register("costPrice")}
                />
                <p className="text-sm text-red-500">
                    {errors.costPrice?.message}
                </p>
            </div>

            <div>
                <Label>
                    PVP (precio al público)
                </Label>
                <Input
                    type="number"
                    step="0.01"
                    {...register("pvp")}
                />
                <p className="text-sm text-muted-foreground">
                    Los perfiles de precio se calculan como descuento sobre este valor.
                </p>
                <p className="text-sm text-red-500">
                    {errors.pvp?.message}
                </p>
            </div>

            <div>
                <Label>
                    PVP en pesos colombianos (opcional)
                </Label>
                <Input
                    type="number"
                    step="1"
                    min="0"
                    {...register("pvpCop")}
                />
                <p className="text-sm text-muted-foreground">
                    Escribe el valor completo, sin puntos ni comas — ej: <strong>450000</strong> para $450.000.
                    Déjalo en 0 si este producto no se vende en COP. Los perfiles de precio también se calculan sobre este valor.
                </p>
                <p className="text-sm text-red-500">
                    {errors.pvpCop?.message}
                </p>
            </div>

            <div>
                <Label>
                    Stock mínimo
                </Label>
                <Input
                    type="number"
                    {...register("minimumStock")}
                />
                <p className="text-sm text-red-500">
                    {errors.minimumStock?.message}
                </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                >
                    Guardar
                </Button>
            </div>
        </form>
    );
}