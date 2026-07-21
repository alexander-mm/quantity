import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { productSchema } from "@/validators";
import type { ProductFormData } from "@/validators";

import {
    useBrands,
    useCategories,
    useUnitsOfMeasure,
    useMarginProfiles
} from "@/hooks";

export function ProductForm() {

    const {

        register,

        control,

        handleSubmit,

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
            brandId: "",
            categoryId: "",
            unitOfMeasureId: "",
            marginProfileId: "",
            costPrice: 0,
            minimumStock: 0
        }
    });

    const { data: brandsData } = useBrands();

    const { data: categoriesData } = useCategories();

    const { data: unitsData } = useUnitsOfMeasure();

    const { data: marginsData } = useMarginProfiles();

    const brands = brandsData?.data ?? [];

    const categories = categoriesData?.data ?? [];

    const units = unitsData?.data ?? [];

    const margins = marginsData?.data ?? [];

    function onSubmit(data: ProductFormData) {
        console.log(data);
    }

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
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

                <div>

                    <Label>Marca</Label>

                    <div>

                        <Label>Categoría</Label>

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

                        <Label>Unidad de medida</Label>

                        <Controller
                            name="unitOfMeasureId"
                            control={control}
                            render={({ field }) => (

                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >

                                    <SelectTrigger className="w-full">

                                        <SelectValue placeholder="Seleccione una unidad" />

                                    </SelectTrigger>

                                    <SelectContent>

                                        {units.map((unit) => (

                                            <SelectItem
                                                key={unit.id}
                                                value={unit.id}
                                            >
                                                {unit.name}
                                            </SelectItem>

                                        ))}

                                    </SelectContent>

                                </Select>

                            )}
                        />

                        <p className="text-sm text-red-500">
                            {errors.unitOfMeasureId?.message}
                        </p>

                    </div>

                    <div>

                        <Label>Perfil de margen</Label>

                        <Controller
                            name="marginProfileId"
                            control={control}
                            render={({ field }) => (

                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >

                                    <SelectTrigger className="w-full">

                                        <SelectValue placeholder="Seleccione un perfil" />

                                    </SelectTrigger>

                                    <SelectContent>

                                        {margins.map((margin) => (

                                            <SelectItem
                                                key={margin.id}
                                                value={margin.id}
                                            >
                                                {margin.name}
                                            </SelectItem>

                                        ))}

                                    </SelectContent>

                                </Select>

                            )}
                        />

                        <p className="text-sm text-red-500">
                            {errors.marginProfileId?.message}
                        </p>

                    </div>

                    <Controller
                        name="brandId"
                        control={control}
                        render={({ field }) => (

                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >

                                <SelectTrigger className="w-full">

                                    <SelectValue placeholder="Seleccione una marca" />

                                </SelectTrigger>

                                <SelectContent>

                                    {brands.map((brand) => (

                                        <SelectItem
                                            key={brand.id}
                                            value={brand.id}
                                        >
                                            {brand.name}
                                        </SelectItem>

                                    ))}

                                </SelectContent>

                            </Select>

                        )}
                    />

                    <p className="text-sm text-red-500">

                        {errors.brandId?.message}

                    </p>

                </div>

                <Input

                    {...register("description")}

                />

            </div>

            <div>

                <Label>

                    Costo

                </Label>

                <Input

                    type="number"

                    {...register("costPrice")}

                />

            </div>

            <div>

                <Label>

                    Stock mínimo

                </Label>


                <Input

                    type="number"

                    {...register("minimumStock")}

                />

            </div>

            <div className="flex justify-end gap-2">

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