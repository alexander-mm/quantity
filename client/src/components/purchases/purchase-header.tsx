import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {
    useSuppliers,
    useStores
} from "@/hooks";

export function PurchaseHeader() {
    const {
        register,
        control,
        formState: { errors }
    } = useFormContext();

    const {
        data: suppliersData
    } = useSuppliers();

    const {
        data: storesData
    } = useStores();

    const suppliers =
        suppliersData?.data ?? [];

    const stores =
        storesData?.data ?? [];

    return (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
                <Label className="mb-1">Número</Label>
                <Input
                    {...register("number")}
                />
                <p className="text-sm text-red-500">
                    {errors.number?.message as string}
                </p>
            </div>

            <div>

                <Label className="mb-1">Fecha</Label>
                <Input
                    type="date"
                    {...register("purchaseDate")}
                />
                <p className="text-sm text-red-500">
                    {errors.purchaseDate?.message as string}
                </p>
            </div>

            <div>
                <Label className="mb-1">Proveedor</Label>
                <Controller
                    control={control}
                    name="supplierId"
                    render={({ field }) => (

                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder="Seleccione"
                                />
                            </SelectTrigger>

                            <SelectContent>
                                {
                                    suppliers.map(item => (

                                        <SelectItem
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.companyName}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.supplierId?.message as string}
                </p>
            </div>

            <div>
                <Label className="mb-1">Bodega</Label>
                <Controller
                    control={control}
                    name="storeId"
                    render={({ field }) => (

                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder="Seleccione"
                                />
                            </SelectTrigger>

                            <SelectContent>
                                {
                                    stores.map(item => (

                                        <SelectItem
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.storeId?.message as string}
                </p>
            </div>

            <div>
                <Label className="mb-1">Referencia</Label>
                <Input
                    {...register("reference")}
                />
            </div>

            <div>
                <Label>Observaciones</Label>
                <Input
                    {...register("observations")}
                />
            </div>
        </div>
    );
}