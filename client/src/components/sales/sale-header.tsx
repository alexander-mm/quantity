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
        getValues,
        setValue,
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
                            onChange={(value) => {

                                field.onChange(value);

                                const selectedClient =
                                    clients.find(client => client.id === value);

                                const discountPercentage =
                                    Number(selectedClient?.discountPercentage ?? 0);

                                const details = getValues("details") ?? [];

                                details.forEach((detail: { quantity?: number; unitPrice?: number }, index: number) => {

                                    const quantity = Number(detail.quantity) || 0;
                                    const unitPrice = Number(detail.unitPrice) || 0;

                                    setValue(
                                        `details.${index}.discount`,
                                        discountPercentage > 0
                                            ? quantity * unitPrice * (discountPercentage / 100)
                                            : 0
                                    );

                                });

                            }}
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

                <Label>Moneda</Label>

                <Controller
                    control={control}
                    name="currency"
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

                                <SelectItem value="USD">
                                    USD
                                </SelectItem>

                                <SelectItem value="COP">
                                    COP
                                </SelectItem>

                            </SelectContent>

                        </Select>

                    )}
                />

                <p className="text-sm text-red-500">
                    {errors.currency?.message as string}
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
