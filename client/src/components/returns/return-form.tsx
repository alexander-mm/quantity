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
import { BarcodeScanButton } from "@/components/scanner";
import { returnSchema } from "@/validators";
import type { ReturnFormData } from "@/validators";
import {
    useSales,
    useProducts,
    useParts,
    useStores,
    useReturns,
    useCreateReturn,
    useOfflineCollection,
    useProductAssemblies,
    useProductComponents,
    useEquipmentParts
} from "@/hooks";
import { generateOfflineId, getNextSequentialCode, matchProductByBarcode, offlineDb, todayLocalDateString } from "@/lib";
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

type ReturnOrigin = "sale" | "assembly" | "none";

type ItemOption = {
    kind: "product" | "part";
    id: string;
    label: string;
};

export function ReturnForm({ onSuccess }: Props) {

    const [origin, setOrigin] = useState<ReturnOrigin>("sale");
    const [noneItemKind, setNoneItemKind] = useState<"product" | "part">("product");

    const { register, control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<ReturnFormData>({
        resolver: zodResolver(returnSchema),
        defaultValues: {
            number: "",
            saleId: "",
            saleDetailId: "",
            assemblyId: "",
            productId: "",
            partId: "",
            storeId: "",
            quantity: undefined,
            reason: undefined,
            notes: "",
            returnDate: todayLocalDateString(),
            disposition: undefined
        }
    });

    const saleId = useWatch({ control, name: "saleId" });
    const saleDetailId = useWatch({ control, name: "saleDetailId" });
    const assemblyId = useWatch({ control, name: "assemblyId" });
    const productId = useWatch({ control, name: "productId" });
    const partId = useWatch({ control, name: "partId" });

    const { data: salesData } = useSales();
    const { data: productsData } = useProducts();
    const { data: partsData } = useParts();
    const { data: storesData } = useStores();
    const { data: returnsData } = useReturns();
    const { data: assembliesData } = useProductAssemblies();
    const createMutation = useCreateReturn();

    const sales = useOfflineCollection(salesData?.data, () => offlineDb.sales.toArray());
    const products = useOfflineCollection(productsData?.data, () => offlineDb.products.toArray());
    const stores = useOfflineCollection(storesData?.data, () => offlineDb.stores.toArray());
    const parts = partsData?.data ?? [];
    const assemblies = assembliesData?.data ?? [];

    const confirmedSales = sales.filter(sale => sale.status === "CONFIRMED");
    const selectedSale = confirmedSales.find(sale => sale.id === saleId);
    const selectedSaleDetail = selectedSale?.details.find(d => d.id === saleDetailId);
    const isKitSaleDetail = !!selectedSaleDetail?.product.assembleOnSale;

    const confirmedAssemblies = assemblies.filter(assembly => assembly.status === "CONFIRMED");
    const selectedAssembly = confirmedAssemblies.find(assembly => assembly.id === assemblyId);

    const kitProductId = selectedSaleDetail?.product.id;
    const { data: kitComponentsData } = useProductComponents(kitProductId);
    const { data: kitPartsData } = useEquipmentParts(kitProductId);
    const kitComponents = kitComponentsData?.data ?? [];
    const kitParts = kitPartsData?.data ?? [];
    const saleDetailHasRecipe = kitComponents.length > 0 || kitParts.length > 0;

    const saleKitItemOptions: ItemOption[] = selectedSaleDetail
        ? [
            {
                kind: "product",
                id: selectedSaleDetail.product.id,
                label: `${selectedSaleDetail.product.name} (producto armado)`
            },
            ...kitComponents.map(item => ({
                kind: "product" as const,
                id: item.componentProductId,
                label: `${item.componentProduct.internalCode} - ${item.componentProduct.name} (componente)`
            })),
            ...kitParts.map(item => ({
                kind: "part" as const,
                id: item.partId,
                label: `${item.part.code} - ${item.part.name} (pieza)`
            }))
        ]
        : [];

    const assemblyItemOptions: ItemOption[] = selectedAssembly
        ? [
            {
                kind: "product",
                id: selectedAssembly.productId,
                label: `${selectedAssembly.product.name} (producto armado)`
            },
            ...selectedAssembly.details.map(item => ({
                kind: "product" as const,
                id: item.componentProductId,
                label: `${item.componentProduct.internalCode} - ${item.componentProduct.name} (componente)`
            })),
            ...selectedAssembly.partDetails.map(item => ({
                kind: "part" as const,
                id: item.partId,
                label: `${item.part.code} - ${item.part.name} (pieza)`
            }))
        ]
        : [];

    const selectItem = (item: ItemOption | null) => {
        setValue("productId", item?.kind === "product" ? item.id : "");
        setValue("partId", item?.kind === "part" ? item.id : "");
    };

    const clearOriginFields = () => {
        setValue("saleId", "");
        setValue("saleDetailId", "");
        setValue("assemblyId", "");
        setValue("productId", "");
        setValue("partId", "");
    };

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
            saleId: origin === "sale" ? (data.saleId || undefined) : undefined,
            saleDetailId: origin === "sale" ? (data.saleDetailId || undefined) : undefined,
            assemblyId: origin === "assembly" ? (data.assemblyId || undefined) : undefined,
            productId: data.productId || undefined,
            partId: data.partId || undefined,
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
                setOrigin("sale");
                setNoneItemKind("product");
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

            <div>
                <Label className="mb-1">Origen de la devolución</Label>
                <Select
                    value={origin}
                    onValueChange={(value) => {
                        setOrigin(value as ReturnOrigin);
                        clearOriginFields();
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione">
                            {(value: string | null) => {
                                if (value === "assembly") return "Viene de una orden de ensamblaje";
                                if (value === "none") return "Directo de inventario (sin venta ni ensamblaje)";
                                return "Viene de una venta registrada";
                            }}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sale">Viene de una venta registrada</SelectItem>
                        <SelectItem value="assembly">Viene de una orden de ensamblaje</SelectItem>
                        <SelectItem value="none">Directo de inventario (sin venta ni ensamblaje)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {origin === "sale" && (
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
                                        setValue("partId", "");
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

            {origin === "sale" && selectedSale && (
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
                                        setValue("partId", "");
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione el producto devuelto">
                                        {(value: string | null) => {
                                            const detail = selectedSale.details.find(d => d.id === value);
                                            return detail
                                                ? `${detail.product.name} (x${Number(detail.quantity)})`
                                                : "Seleccione el producto devuelto";
                                        }}
                                    </SelectValue>
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

            {origin === "sale" && saleDetailHasRecipe && (
                <div>
                    <Label className="mb-1">Ítem a devolver</Label>
                    {(() => {

                        const selected = saleKitItemOptions.find(item =>
                            (item.kind === "product" && item.id === productId) ||
                            (item.kind === "part" && item.id === partId)
                        ) ?? null;

                        return (
                            <Combobox
                                items={saleKitItemOptions}
                                value={selected}
                                onValueChange={selectItem}
                            >
                                <ComboboxInput placeholder="Buscar ítem de la receta..." />
                                <ComboboxContent>
                                    {(item) => <ComboboxItem key={`${item.kind}-${item.id}`} value={item}>{item.label}</ComboboxItem>}
                                </ComboboxContent>
                                <ComboboxEmpty>No se encontraron ítems.</ComboboxEmpty>
                            </Combobox>
                        );

                    })()}
                    <p className="mt-1 text-xs text-muted-foreground">
                        {isKitSaleDetail
                            ? `"${selectedSaleDetail?.product.name}" es un kit que se arma al vender: no lleva stock propio. Elige si devuelves el producto armado o un componente/pieza puntual de su receta.`
                            : `"${selectedSaleDetail?.product.name}" tiene una receta de componentes/piezas. Si eliges un componente o pieza en vez del producto, sale de su stock recién al registrar esta devolución (la venta no lo había descontado).`}
                    </p>
                </div>
            )}

            {origin === "assembly" && (
                <div>
                    <Label className="mb-1">Orden de ensamblaje</Label>
                    <Controller
                        control={control}
                        name="assemblyId"
                        render={({ field }) => {

                            const items = confirmedAssemblies.map(assembly => ({
                                value: assembly.id,
                                label: `${assembly.number} - ${assembly.product.name} (x${Number(assembly.quantity)})`,
                                productId: assembly.productId
                            }));

                            const selected = items.find(item => item.value === field.value) ?? null;

                            return (
                                <Combobox
                                    items={items}
                                    value={selected}
                                    onValueChange={(item) => {
                                        field.onChange(item ? item.value : "");
                                        setValue("productId", item ? item.productId : "");
                                        setValue("partId", "");
                                    }}
                                >
                                    <ComboboxInput placeholder="Buscar orden de ensamblaje por número..." />
                                    <ComboboxContent>
                                        {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                                    </ComboboxContent>
                                    <ComboboxEmpty>No se encontraron órdenes de ensamblaje confirmadas.</ComboboxEmpty>
                                </Combobox>
                            );

                        }}
                    />
                    <p className="text-sm text-red-500">{errors.assemblyId?.message}</p>
                </div>
            )}

            {origin === "assembly" && selectedAssembly && (
                <div>
                    <Label className="mb-1">Ítem a devolver</Label>
                    {(() => {

                        const selected = assemblyItemOptions.find(item =>
                            (item.kind === "product" && item.id === productId) ||
                            (item.kind === "part" && item.id === partId)
                        ) ?? null;

                        return (
                            <Combobox
                                items={assemblyItemOptions}
                                value={selected}
                                onValueChange={selectItem}
                            >
                                <ComboboxInput placeholder="Buscar ítem de la receta..." />
                                <ComboboxContent>
                                    {(item) => <ComboboxItem key={`${item.kind}-${item.id}`} value={item}>{item.label}</ComboboxItem>}
                                </ComboboxContent>
                                <ComboboxEmpty>No se encontraron ítems.</ComboboxEmpty>
                            </Combobox>
                        );

                    })()}
                    <p className="mt-1 text-xs text-muted-foreground">
                        Úsalo cuando algo salió defectuoso de fábrica en ese lote de ensamblaje: puede ser el
                        producto armado completo o un componente/pieza puntual de su receta. El ítem elegido sale
                        del stock vendible al registrar la devolución.
                    </p>
                </div>
            )}

            {origin === "none" && (
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="noneIsPart"
                        checked={noneItemKind === "part"}
                        onChange={(e) => {
                            setNoneItemKind(e.target.checked ? "part" : "product");
                            setValue("productId", "");
                            setValue("partId", "");
                        }}
                    />
                    <Label htmlFor="noneIsPart">Es una pieza (no un producto)</Label>
                </div>
            )}

            {origin === "none" && noneItemKind === "product" && (
                <div>
                    <Label className="mb-1">Producto</Label>
                    <Controller
                        control={control}
                        name="productId"
                        render={({ field }) => {

                            const items = products.map(product => ({ value: product.id, label: `${product.internalCode} - ${product.name}` }));
                            const selected = items.find(item => item.value === field.value) ?? null;

                            const handleTypedText = (text: string) => {
                                const match = matchProductByBarcode(products, text);
                                if (match) {
                                    field.onChange(match.id);
                                }
                            };

                            const handleScannedText = (text: string) => {
                                const match = matchProductByBarcode(products, text);
                                if (match) {
                                    field.onChange(match.id);
                                } else {
                                    toast.error(`No se encontró un producto con el código "${text}".`);
                                }
                            };

                            return (
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <Combobox
                                            items={items}
                                            value={selected}
                                            onValueChange={(item) => field.onChange(item ? item.value : "")}
                                            onInputValueChange={handleTypedText}
                                        >
                                            <ComboboxInput placeholder="Buscar producto..." />
                                            <ComboboxContent>
                                                {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                                            </ComboboxContent>
                                            <ComboboxEmpty>No se encontraron productos.</ComboboxEmpty>
                                        </Combobox>
                                    </div>
                                    <BarcodeScanButton onScan={handleScannedText} />
                                </div>
                            );

                        }}
                    />
                    <p className="text-sm text-red-500">{errors.productId?.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Úsalo para defectos de fábrica o productos dañados hallados directamente en inventario. El
                        producto sale del stock vendible al registrar la devolución.
                    </p>
                </div>
            )}

            {origin === "none" && noneItemKind === "part" && (
                <div>
                    <Label className="mb-1">Pieza</Label>
                    <Controller
                        control={control}
                        name="partId"
                        render={({ field }) => {

                            const items = parts.map(part => ({ value: part.id, label: `${part.code} - ${part.name}` }));
                            const selected = items.find(item => item.value === field.value) ?? null;

                            return (
                                <Combobox
                                    items={items}
                                    value={selected}
                                    onValueChange={(item) => field.onChange(item ? item.value : "")}
                                >
                                    <ComboboxInput placeholder="Buscar pieza..." />
                                    <ComboboxContent>
                                        {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                                    </ComboboxContent>
                                    <ComboboxEmpty>No se encontraron piezas.</ComboboxEmpty>
                                </Combobox>
                            );

                        }}
                    />
                    <p className="text-sm text-red-500">{errors.partId?.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Úsalo para piezas dañadas o defectuosas halladas directamente en inventario. La pieza sale
                        de su existencia al registrar la devolución.
                    </p>
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
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione">
                                        {(value: string | null) =>
                                            stores.find(store => store.id === value)?.name ?? "Seleccione"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
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
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un motivo">
                                    {(value: string | null) =>
                                        (value && RETURN_REASON_LABELS[value as keyof typeof RETURN_REASON_LABELS]) ?? "Seleccione un motivo"
                                    }
                                </SelectValue>
                            </SelectTrigger>
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
                            <SelectTrigger>
                                <SelectValue placeholder="Dejar pendiente de revisión">
                                    {(value: string | null) => {
                                        if (value === "RESTOCK") return "Vuelve a stock vendible";
                                        if (value === "DAMAGED") return "Dañado";
                                        return "Dejar pendiente de revisión";
                                    }}
                                </SelectValue>
                            </SelectTrigger>
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
