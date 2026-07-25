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
    useClients,
    useStores
} from "@/hooks";
import { ClientSelector } from "@/components/selectors";

export function SaleHeader() {
    const {
        register,
        control,
        formState: { errors }
    } = useFormContext();

    const {
        data: clientsData
    } = useClients();

    const {
        data: storesData
    } = useStores();

    const clients =
    clientsData?.data ?? [];

    const stores =
    storesData?.data ?? [];

    return (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>

                <Label>Número</Label>

                <Input
                    {...register("number")}
                />

                <p className="text-sm text-red-500">
                    {errors.number?.message as string}
                </p>

            </div>

            <div>

                <Label>Fecha</Label>

                <Input
                    type="date"
                    {...register("saleDate")}
                />

                <p className="text-sm text-red-500">
                    {errors.saleDate?.message as string}
                </p>

            </div>

            <div>

                <Controller
                    control={control}
                    name="clientId"
                    render={({ field }) => (

                        <ClientSelector
                            clients={clients}
                            value={field.value}
                            onChange={field.onChange}
                        />

                    )}
                />

                <p className="text-sm text-red-500">
                    {errors.clientId?.message as string}
                </p>

            </div>

            <div>

                <Label>Bodega</Label>

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

                <Label>Referencia</Label>

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
