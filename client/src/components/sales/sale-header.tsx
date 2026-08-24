import { Controller, useFormContext } from "react-hook-form";
import { toast } from "react-hot-toast";
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
    useProducts,
    useProductPriceEntryLabels,
    useOfflineCollection
} from "@/hooks";
import { resolveProductPriceEntries, getCachedPriceEntryLabels, offlineDb } from "@/lib";
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

    const {
        data: productsData
    } = useProducts();

    const clients =
        useOfflineCollection(clientsData?.data, () => offlineDb.clients.toArray());

    const stores =
        useOfflineCollection(storesData?.data, () => offlineDb.stores.toArray());

    const priceEntryLabels =
        useOfflineCollection(priceEntryLabelsData?.data, getCachedPriceEntryLabels);

    const products =
        useOfflineCollection(productsData?.data, () => offlineDb.products.toArray());

    const clientId = watch("clientId");
    const selectedClient = clients.find(client => client.id === clientId);
    const currencyLocked = !!selectedClient?.isWholesaler && !!selectedClient?.currency;
    const clientCurrency = currencyLocked ? selectedClient!.currency : null;
    const clientDiscountPercentage = Number(selectedClient?.discountPercentage ?? 0);
    const hasClientDiscount = clientDiscountPercentage > 0;
    const totalDiscountPercentage = Number(watch("totalDiscountPercentage") ?? 0);

    const filteredPriceEntryLabels = clientCurrency
        ? priceEntryLabels.filter(entry => entry.currency === clientCurrency)
        : priceEntryLabels;

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
        const entryLabel = `PVP ${entryCurrency} ${entrySequenceRaw}`;
        const details = getValues("details") ?? [];
        const productsMissingPrice: string[] = [];

        for (let index = 0; index < details.length; index++) {

            const productId = details[index]?.productId;

            if (!productId) {
                continue;
            }

            try {

                const entries = await resolveProductPriceEntries(productId);
                const match = entries.find(
                    entry => entry.currency === entryCurrency && entry.sequence === entrySequence
                );

                const newUnitPrice = match ? Number(match.price) : undefined;

                setValue(`details.${index}.unitPrice`, newUnitPrice);

                if (!match) {

                    const product = products.find(item => item.id === productId);
                    productsMissingPrice.push(product ? `${product.internalCode} - ${product.name}` : productId);

                } else if (hasClientDiscount) {

                    const quantity = Number(details[index]?.quantity) || 0;

                    setValue(
                        `details.${index}.discount`,
                        quantity * Number(match.price) * (clientDiscountPercentage / 100)
                    );

                } else if (totalDiscountPercentage > 0) {

                    const quantity = Number(details[index]?.quantity) || 0;

                    setValue(
                        `details.${index}.discount`,
                        quantity * Number(match.price) * (totalDiscountPercentage / 100)
                    );

                }

            } catch (error) {
                console.error(error);
            }

        }

        if (productsMissingPrice.length > 0) {
            toast.error(
                `Sin precio "${entryLabel}" para: ${productsMissingPrice.join(", ")}. Ingresa el precio manualmente en cada línea.`
            );
        }

    };

    return (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
                <Label className="mb-1">Número</Label>
                <Input
                    {...register("number")}
                    readOnly
                    disabled
                    placeholder="Se asigna automáticamente al guardar"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                    Consecutivo de la tienda, asignado automáticamente. No se puede editar.
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

                                const newClientCurrency =
                                    selected?.isWholesaler && selected?.currency
                                        ? selected.currency
                                        : null;

                                const currentPriceEntryKey: string = getValues("priceEntryKey") ?? "";
                                const [currentEntryCurrency] = currentPriceEntryKey.split("-");

                                if (
                                    newClientCurrency &&
                                    currentPriceEntryKey &&
                                    currentEntryCurrency !== newClientCurrency
                                ) {
                                    setValue("priceEntryKey", "");
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
                                {filteredPriceEntryLabels.map(entry => (
                                    <SelectItem key={`${entry.currency}-${entry.sequence}`} value={`${entry.currency}-${entry.sequence}`}>
                                        {entry.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                <p className="mt-1 text-xs text-muted-foreground">
                    {clientCurrency
                        ? `Se aplica de inmediato a todos los productos ya agregados a la venta. Solo se muestran precios en ${clientCurrency}, la moneda asignada al cliente.`
                        : "Se aplica de inmediato a todos los productos ya agregados a la venta. Es independiente de la moneda."}
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
                                placeholder="0"
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