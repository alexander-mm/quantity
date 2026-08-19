import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks";
import { getProductById, getProductPriceEntries } from "@/services";
import { matchProductByBarcode } from "@/lib";

type Props={
    index:number;
    onRemove:()=>void;
};

export function PurchaseDetailRow({
    index,
    onRemove
}:Props){

    const{
        control,
        register,
        watch,
        setValue,
        formState:{errors}
    }=useFormContext();

    const{
        data:productsData
    }=useProducts();

    const products=
        productsData?.data??[];

    const details=
        watch("details") as { productId?: string }[] | undefined;

    const selectedProductIds=
        new Set(
            (details??[])
                .filter((_, detailIndex)=>detailIndex!==index)
                .map(detail=>detail?.productId)
                .filter(Boolean)
        );

    const quantity=
        Number(
            watch(`details.${index}.quantity`)
        )||0;

    const unitCost=
        Number(
            watch(`details.${index}.unitCost`)
        )||0;

    const discount=
        Number(
            watch(`details.${index}.discount`)
        )||0;

    const tax=
        Number(
            watch(`details.${index}.tax`)
        )||0;

    const total=
        quantity*
        unitCost-
        discount+
        tax;

    const {
        fields: priceEntryFields,
        append: appendPriceEntry,
        remove: removePriceEntry,
        replace: replacePriceEntries
    } = useFieldArray({ control, name: `details.${index}.priceEntries` });

    const watchedPriceEntries = useWatch({ control, name: `details.${index}.priceEntries` }) ?? [];

    useEffect(() => {

        const firstUsdEntry = watchedPriceEntries.find((e: { currency: string }) => e?.currency === "USD");
        const firstCopEntry = watchedPriceEntries.find((e: { currency: string }) => e?.currency === "COP");

        setValue(`details.${index}.pvp`, firstUsdEntry ? Number(firstUsdEntry.price) || 0 : 0);
        setValue(`details.${index}.pvpCop`, firstCopEntry ? Number(firstCopEntry.price) || 0 : 0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watchedPriceEntries), setValue, index]);

    return(

        <div className="space-y-3 rounded-lg border p-3">

            <div>

                <Label className="mb-1">Producto</Label>

                <Controller
                    control={control}
                    name={`details.${index}.productId`}
                    render={({field})=>{

                        const availableProducts=products
                            .filter(product=>!selectedProductIds.has(product.id));

                        const items=availableProducts
                            .map(product=>({
                                value:product.id,
                                label:`${product.internalCode} - ${product.name}`
                            }));

                        const selected=
                            items.find(item=>item.value===field.value)
                            ??null;

                        const handleSelect=(item:{value:string;label:string}|null)=>{

                            field.onChange(item?item.value:"");

                            if(!item){
                                return;
                            }

                            getProductById(item.value).then(response=>{

                                const product=response.data;

                                setValue(
                                    `details.${index}.unitCost`,
                                    Number(product.costPrice)
                                );

                            }).catch(error=>{
                                console.error(error);
                            });

                            getProductPriceEntries(item.value).then(response => {

                                replacePriceEntries(
                                    response.data.map(entry => ({
                                        currency: entry.currency,
                                        sequence: entry.sequence,
                                        price: Number(entry.price)
                                    }))
                                );

                            }).catch(error => {
                                console.error(error);
                            });

                        };

                        return(

                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={handleSelect}
                                onInputValueChange={(text)=>{
                                    const match=matchProductByBarcode(availableProducts,text);
                                    if(match){
                                        handleSelect({value:match.id,label:`${match.internalCode} - ${match.name}`});
                                    }
                                }}
                            >

                                <ComboboxInput
                                    placeholder="Buscar producto..."
                                />

                                <ComboboxContent>
                                    {(item)=>(
                                        <ComboboxItem
                                            key={item.value}
                                            value={item}
                                        >
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxContent>

                                <ComboboxEmpty>
                                    No se encontraron productos.
                                </ComboboxEmpty>

                            </Combobox>

                        );

                    }}
                />

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div>

                    <Label className="mb-1">Cantidad</Label>

                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...register(
                            `details.${index}.quantity`,
                            {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            }
                        )}
                    />

                </div>

                <div>

                    <Label className="mb-1">Costo</Label>

                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...register(
                            `details.${index}.unitCost`,
                            {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            }
                        )}
                    />

                </div>

                <div>

                    <Label className="mb-1">Descuento</Label>

                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...register(
                            `details.${index}.discount`,
                            {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            }
                        )}
                    />

                </div>

                <div>

                    <Label className="mb-1">IVA</Label>

                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...register(
                            `details.${index}.tax`,
                            {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            }
                        )}
                    />

                </div>

            </div>

            <div className="space-y-2 rounded-md border p-2">

                <Label className="mb-1">Precios de venta</Label>
                <p className="text-xs text-muted-foreground">
                    PVP USD 1 y PVP COP 1 se usan como precio base de este producto para el resto de los procesos.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {priceEntryFields.map((field, priceIndex) => {

                        const currency = watchedPriceEntries[priceIndex]?.currency ?? "";
                        const sequence = watchedPriceEntries[priceIndex]?.sequence ?? "";

                        return (
                            <div key={field.id} className="col-span-1 flex items-end gap-1">
                                <div className="flex-1">
                                    <Label className="mb-1 text-xs">{`PVP ${currency} ${sequence}`}</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        placeholder="0"
                                        {...register(`details.${index}.priceEntries.${priceIndex}.price`, {
                                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                                        })}
                                    />
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removePriceEntry(priceIndex)}>
                                    <Trash2 size={16} className="text-red-500" />
                                </Button>
                            </div>
                        );

                    })}
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const nextSequence = watchedPriceEntries.filter((e: { currency: string }) => e?.currency === "USD").length + 1;
                            appendPriceEntry({ currency: "USD", sequence: nextSequence, price: undefined });
                        }}
                    >
                        <Plus size={16} />
                        PVP USD
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const nextSequence = watchedPriceEntries.filter((e: { currency: string }) => e?.currency === "COP").length + 1;
                            appendPriceEntry({ currency: "COP", sequence: nextSequence, price: undefined });
                        }}
                    >
                        <Plus size={16} />
                        PVP COP
                    </Button>
                </div>

                <p className="text-sm text-red-500">
                    {(errors.details as { [key: number]: { pvp?: { message?: string } } } | undefined)?.[index]?.pvp?.message
                        ? "Debes agregar al menos un precio en USD (será el PVP USD 1)."
                        : ""}
                </p>

            </div>

            <div className="flex items-center justify-between border-t pt-3">

                <span className="font-medium">
                    Total: ${total.toFixed(2)}
                </span>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                >

                    <Trash2
                        size={18}
                        className="text-red-500"
                    />

                </Button>

            </div>

        </div>

    );

}
