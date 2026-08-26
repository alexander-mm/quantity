import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProducts, useClients } from "@/hooks";
import { formatCurrency } from "@/lib/format-currency";

type Props = {
    index: number;
    onRemove: () => void;
};

export function QuoteDetailRow({ index, onRemove }: Props) {

    const { control, register, watch, setValue, formState: { errors } } = useFormContext();

    const { data: productsData } = useProducts();
    const products = productsData?.data ?? [];

    const { data: clientsData } = useClients();
    const clients = clientsData?.data ?? [];

    const currency = watch("currency");
    const isCop = currency === "COP";

    const clientId = watch("clientId");
    const selectedClient = clients.find(client => client.id === clientId);
    const clientDiscountPercentage = Number(selectedClient?.discountPercentage ?? 0);

    const quantity = Number(watch(`details.${index}.quantity`)) || 0;
    const unitPrice = Number(watch(`details.${index}.unitPrice`)) || 0;
    const discount = Number(watch(`details.${index}.discount`)) || 0;
    const tax = Number(watch(`details.${index}.tax`)) || 0;

    const total = (quantity * unitPrice) - discount + tax;

    const applyClientDiscount = (newQuantity: number, newUnitPrice: number) => {

        if (clientDiscountPercentage > 0) {
            setValue(`details.${index}.discount`, newQuantity * newUnitPrice * (clientDiscountPercentage / 100));
        }

    };

    return (
        <div className="space-y-3 rounded-lg border p-3">

            <div>
                <Label className="mb-1">Producto</Label>
                <Controller
                    control={control}
                    name={`details.${index}.productId`}
                    render={({ field }) => {

                        const items = products.map(product => ({
                            value: product.id,
                            label: `${product.internalCode} - ${product.name}`
                        }));

                        const selected = items.find(item => item.value === field.value) ?? null;

                        return (
                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={(item) => {

                                    field.onChange(item ? item.value : "");

                                    if (!item) {
                                        return;
                                    }

                                    const product = products.find(p => p.id === item.value);
                                    const priceForCurrency = isCop ? product?.pvpCop : product?.pvp;

                                    if (priceForCurrency !== undefined && priceForCurrency !== null) {
                                        const newUnitPrice = Number(priceForCurrency);
                                        setValue(`details.${index}.unitPrice`, newUnitPrice);
                                        applyClientDiscount(quantity, newUnitPrice);
                                    }

                                }}
                            >
                                <ComboboxInput placeholder="Buscar producto..." />
                                <ComboboxContent>
                                    {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                                </ComboboxContent>
                                <ComboboxEmpty>No se encontraron productos.</ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                <p className="text-sm text-red-500">
                    {(errors.details as { [key: number]: { productId?: { message?: string } } } | undefined)?.[index]?.productId?.message}
                </p>
            </div>

            {clientDiscountPercentage > 0 && (
                <p className="text-sm text-muted-foreground">
                    Descuento de cliente ({clientDiscountPercentage}%)
                </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div>
                    <Label className="mb-1">Cantidad</Label>
                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...register(`details.${index}.quantity`, {
                            setValueAs: (v) => (v === "" ? undefined : Number(v)),
                            onChange: (e) => applyClientDiscount(Number(e.target.value) || 0, unitPrice)
                        })}
                    />
                </div>

                <div>
                    <Label className="mb-1">Precio unit.</Label>
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0"
                        {...register(`details.${index}.unitPrice`, {
                            setValueAs: (v) => (v === "" ? undefined : Number(v)),
                            onChange: (e) => applyClientDiscount(quantity, Number(e.target.value) || 0)
                        })}
                    />
                </div>

                <div>
                    <Label className="mb-1">Descuento</Label>
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0"
                        {...register(`details.${index}.discount`, {
                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                        })}
                    />
                </div>

                <div>
                    <Label className="mb-1">IVA</Label>
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0"
                        {...register(`details.${index}.tax`, {
                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                        })}
                    />
                </div>

            </div>

            <div className="flex items-center justify-between border-t pt-3">
                <span className="font-medium">Total: {formatCurrency(total, currency)}</span>
                <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
                    <Trash2 size={18} className="text-red-500" />
                </Button>
            </div>

        </div>
    );
}
