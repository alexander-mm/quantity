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
    useStores,
    useProductPriceEntryLabels
} from "@/hooks";
import { getProductPriceEntries } from "@/services";
import { ClientSelector } from "@/components/selectors";

export function SaleHeader() {
    const {
        register,
        control,
        getValues,
        setValue,
        watch,
        formState: { errors }
    } = useFormContext();

    const {
        data: clientsData
    } = useClients();

    const {
        data: storesData
    } = useStores();

    const {
        data: priceEntryLabelsData
    } = useProductPriceEntryLabels();

    const clients =
        clientsData?.data ?? [];

    const stores =
        storesData?.data ?? [];

    const priceEntryLabels =
        priceEntryLabelsData?.data ?? [];

    const clientId = watch("clientId");
    const selectedClient = clients.find(client => client.id === clientId);
    const requiresAccountReceivable = !!selectedClient?.isWholesaler && !!selectedClient?.usesCredit;
    const currencyLocked = !!selectedClient?.isWholesaler && !!selectedClient?.currency;
    const clientDiscountPercentage = Number(selectedClient?.discountPercentage ?? 0);
    const hasClientDiscount = clientDiscountPercentage > 0;

    const applyTotalDiscountToAllLines = (percentage: number) => {

        setValue("totalDiscountPercentage", percentage);

        const details = getValues("details") ?? [];

        details.forEach((detail: { quantity?: number; unitPrice?: number }, index: number) => {

            const quantity = Number(detail.quantity) || 0;
            const unitPrice = Number(detail.unitPrice) || 0;

            setValue(
                `details.${index}.discount`,
                percentage > 0 ? quantity * unitPrice * (percentage / 100) : 0
            );

        });

    };

    const applyPriceEntryToAllLines = async (priceEntryKey: string) => {

        setValue("priceEntryKey", priceEntryKey);

        if (!priceEntryKey) {
            return;
        }

        const [entryCurrency, entrySequenceRaw] = priceEntryKey.split("-");
        const entrySequence = Number(entrySequenceRaw);
        const details = getValues("details") ?? [];

        for (let index = 0; index < details.length; index++) {

            const productId = details[index]?.productId;

            if (!productId) {
                continue;
            }

            try {

                const response = await getProductPriceEntries(productId);
                const match = response.data.find(
                    entry => entry.currency === entryCurrency && entry.sequence === entrySequence
                );

                setValue(
                    `details.${index}.unitPrice`,
                    match ? Number(match.price) : undefined
                );

            } catch (error) {
                console.error(error);
            }

        }

    };

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

                                const selected =
                                    clients.find(client => client.id === value);

                                const discountPercentage =
                                    Number(selected?.discountPercentage ?? 0);

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

                                if (selected?.isWholesaler && selected?.currency) {
                                    setValue("currency", selected.currency);
                                }

                                if (!(selected?.isWholesaler && selected?.usesCredit)) {
                                    setValue("accountReceivableNumber", "");
                                }

                            }}
                        />

                    )}
                />

                <p className="text-sm text-red-500">
                    {errors.clientId?.message as string}
                </p>
            </div>

            <div>
                <Label className="mb-1">Precio</Label>

                <Controller
                    control={control}
                    name="priceEntryKey"
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                applyPriceEntryToAllLines(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Precio base del producto" />
                            </SelectTrigger>
                            <SelectContent>
                                {priceEntryLabels.map(entry => (
                                    <SelectItem key={`${entry.currency}-${entry.sequence}`} value={`${entry.currency}-${entry.sequence}`}>
                                        {entry.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                <p className="mt-1 text-xs text-muted-foreground">
                    Se aplica de inmediato a todos los productos ya agregados a la venta. Es independiente de la moneda.
                </p>
            </div>

            {!hasClientDiscount && (
                <div>
                    <Label className="mb-1">Descuento sobre el total (%)</Label>

                    <Controller
                        control={control}
                        name="totalDiscountPercentage"
                        render={({ field }) => (
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                    const percentage = Number(e.target.value) || 0;
                                    field.onChange(percentage);
                                    applyTotalDiscountToAllLines(percentage);
                                }}
                            />
                        )}
                    />

                    <p className="mt-1 text-xs text-muted-foreground">
                        Se aplica de inmediato a todos los productos ya agregados a la venta, repartido proporcionalmente.
                        Este cliente no tiene un porcentaje de descuento asignado.
                    </p>
                </div>
            )}

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
                <Label className="mb-1">Moneda</Label>

                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (

                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={currencyLocked}
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

                {currencyLocked && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Moneda fija según el mayorista seleccionado.
                    </p>
                )}

                <p className="text-sm text-red-500">
                    {errors.currency?.message as string}
                </p>

            </div>

            {requiresAccountReceivable && (
                <div>

                    <Label>Número de cuenta de cobro</Label>

                    <Input
                        {...register("accountReceivableNumber")}
                    />

                    <p className="mt-1 text-xs text-muted-foreground">
                        Este cliente mayorista maneja crédito — la venta pasará a Mayoristas con esta cuenta de cobro pendiente de pago.
                    </p>

                    <p className="text-sm text-red-500">
                        {errors.accountReceivableNumber?.message as string}
                    </p>

                </div>
            )}

            <div>
                <Label className="mb-1">Referencia</Label>
                <Input
                    {...register("reference")}
                />
            </div>

            <div>
                <Label className="mb-1">Observaciones</Label>

                <Input
                    {...register("observations")}
                />
            </div>
        </div>
    );
}