import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox";
import { returnSchema } from "@/validators";
import type { ReturnFormData } from "@/validators";
import { useSales, useProducts, useStores, useReturns, useCreateReturn, useOfflineCollection } from "@/hooks";
import { generateOfflineId, getNextSequentialCode, offlineDb, todayLocalDateString } from "@/lib";
import { RETURN_REASON_LABELS } from "./return-reason-labels";
import type { ReturnDisposition } from "@/types";

function getClientLabel(client: { companyName: string | null; firstName: string | null; lastName: string | null }) {
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || "Cliente");
}

type Props = {
    onSuccess?: () => void;
};

export function ReturnForm({ onSuccess }: Props) {

    const [linkToSale, setLinkToSale] = useState(true);

    const { register, control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<ReturnFormData>({
        resolver: zodResolver(returnSchema),
        defaultValues: {
            number: "",
            saleId: "",
            saleDetailId: "",
            productId: "",
            storeId: "",
            quantity: undefined,
            reason: undefined,
            notes: "",
            returnDate: todayLocalDateString(),
            disposition: undefined
        }
    });

    const saleId = useWatch({ control, name: "saleId" });

    const { data: salesData } = useSales();
    const { data: productsData } = useProducts();
    const { data: storesData } = useStores();
    const { data: returnsData } = useReturns();
    const createMutation = useCreateReturn();

    const sales = useOfflineCollection(salesData?.data, () => offlineDb.sales.toArray());
    const products = useOfflineCollection(productsData?.data, () => offlineDb.products.toArray());
    const stores = useOfflineCollection(storesData?.data, () => offlineDb.stores.toArray());

    const confirmedSales = sales.filter(sale => sale.status === "CONFIRMED");
    const selectedSale = confirmedSales.find(sale => sale.id === saleId);

    useEffect(() => {

        if (!returnsData?.data || getValues("number")) {
            return;
        }

        const [lastReturn] = [...returnsData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastReturn?.number);

        if (nextNumber) {
            setValue("number", nextNumber);
        }

    }, [returnsData, getValues, setValue]);

    const onSubmit = (data: ReturnFormData) => {

        const payload = {
            clientUuid: generateOfflineId(),
            number: data.number,
            saleId: linkToSale ? (data.saleId || undefined) : undefined,
            saleDetailId: linkToSale ? (data.saleDetailId || undefined) : undefined,
            productId: data.productId,
            storeId: data.storeId,
            quantity: Number(data.quantity),
            reason: data.reason,
            notes: data.notes || undefined,
            returnDate: new Date(data.returnDate),
            disposition: (data.disposition || undefined) as ReturnDisposition | undefined
        };

        createMutation.mutate(payload, {
            onSuccess: (result) => {
                if (result.queued) {
                    toast.success("Sin conexión: la devolución quedó guardada y se sincronizará automáticamente.");
                } else {
                    toast.success("Devolución registrada correctamente.");
                }
                reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo registrar la devolución.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate className="space-y-5">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                    <Label className="mb-1">Número</Label>
                    <Input {...register("number")} />
                    <p className="text-sm text-red-500">{errors.number?.message}</p>
                </div>

                <div>
                    <Label className="mb-1">Fecha</Label>
                    <Input type="date" {...register("returnDate")} />
                    <p className="text-sm text-red-500">{errors.returnDate?.message}</p>
                </div>

            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="linkToSale"
                    checked={linkToSale}
                    onChange={(e) => {
                        setLinkToSale(e.target.checked);
                        setValue("saleId", "");
                        setValue("saleDetailId", "");
                        setValue("productId", "");
                    }}
                />
                <Label htmlFor="linkToSale">Viene de una venta registrada</Label>
            </div>

            {linkToSale && (
                <div>
                    <Label className="mb-1">Venta</Label>
                    <Controller
                        control={control}
                        name="saleId"
                        render={({ field }) => {

                            const items = confirmedSales.map(sale => ({
                                value: sale.id,
                                label: `${sale.number} - ${getClientLabel(sale.client)}`
                            }));

                            const selected = items.find(item => item.value === field.value) ?? null;

                            return (
                                <Combobox
                                    items={items}
                                    value={selected}
                                    onValueChange={(item) => {
                                        field.onChange(item ? item.value : "");
                                        setValue("saleDetailId", "");
                                        setValue("productId", "");
                                    }}
                                >
                                    <ComboboxInput placeholder="Buscar venta por número..." />
                                    <ComboboxContent>
                                        {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                                    </ComboboxContent>
                                    <ComboboxEmpty>No se encontraron ventas confirmadas.</ComboboxEmpty>
                                </Combobox>
                            );

                        }}
                    />
                </div>
            )}

            {linkToSale && selectedSale && (
                <div>
                    <Label className="mb-1">Línea de la venta</Label>
                    <Controller
                        control={control}
                        name="saleDetailId"
                        render={({ field }) => (
                            <Select
                                value={field.value ?? ""}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    const detail = selectedSale.details.find(d => d.id === value);
                                    if (detail) {
                                        setValue("productId", detail.product.id);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione el producto devuelto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedSale.details.map(detail => (
                                        <SelectItem key={detail.id} value={detail.id}>
                                            {detail.product.name} (x{Number(detail.quantity)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className="text-sm text-red-500">{errors.saleDetailId?.message}</p>
                </div>
            )}

            {!linkToSale && (
                <div>
                    <Label className="mb-1">Producto</Label>
                    <Controller
                        control={control}
                        name="productId"
                        render={({ field }) => {

                            const items = products.map(product => ({ value: product.id, label: `${product.internalCode} - ${product.name}` }));
                            const selected = items.find(item => item.value === field.value) ?? null;

                            return (
                                <Combobox items={items} value={selected} onValueChange={(item) => field.onChange(item ? item.value : "")}>
                                    <ComboboxInput placeholder="Buscar producto..." />
                                    <ComboboxContent>
                                        {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                                    </ComboboxContent>
                                    <ComboboxEmpty>No se encontraron productos.</ComboboxEmpty>
                                </Combobox>
                            );

                        }}
                    />
                    <p className="text-sm text-red-500">{errors.productId?.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                    <Label className="mb-1">Tienda / bodega destino</Label>
                    <Controller
                        control={control}
                        name="storeId"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                                <SelectContent>
                                    {stores.map(store => (
                                        <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className="text-sm text-red-500">{errors.storeId?.message}</p>
                </div>

                <div>
                    <Label className="mb-1">Cantidad</Label>
                    <Input type="number" min={0} step="1" placeholder="0" {...register("quantity", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })} />
                    <p className="text-sm text-red-500">{errors.quantity?.message}</p>
                </div>

            </div>

            <div>
                <Label className="mb-1">Motivo</Label>
                <Controller
                    control={control}
                    name="reason"
                    render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Seleccione un motivo" /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(RETURN_REASON_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">{errors.reason?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Notas (opcional)</Label>
                <Input {...register("notes")} />
            </div>

            <div>
                <Label className="mb-1">Destino (opcional)</Label>
                <Controller
                    control={control}
                    name="disposition"
                    render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={(value) => field.onChange(value || undefined)}>
                            <SelectTrigger><SelectValue placeholder="Dejar pendiente de revisión" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RESTOCK">Vuelve a stock vendible</SelectItem>
                                <SelectItem value="DAMAGED">Dañado</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    Si no estás seguro (ej. garantía por revisar), déjalo vacío — queda "pendiente de revisión"
                    y se resuelve después.
                </p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Guardando..." : "Registrar devolución"}
                </Button>
            </div>

        </form>
    );

}
