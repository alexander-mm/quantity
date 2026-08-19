import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Controller, useFormContext, useWatch } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts, useProductPriceEntries, useClients, useMarginProfiles, useOfflineCollection, useKitAvailability } from "@/hooks";
import { resolveProductPriceEntries, getCachedProductPriceEntries, offlineDb, matchProductByBarcode } from "@/lib";
import { formatCurrency } from "@/lib/format-currency";

const NO_PROFILE = "none";

type Props={
    index:number;
    onRemove:()=>void;
};

export function SaleDetailRow({
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

    const currency=
        watch("currency");

    const isCop=
        currency==="COP";

    const allProducts=
        useOfflineCollection(productsData?.data, () => offlineDb.products.toArray());

    const details=
        watch("details") as { productId?: string }[] | undefined;

    const selectedProductIds=
        new Set(
            (details??[])
                .filter((_, detailIndex)=>detailIndex!==index)
                .map(detail=>detail?.productId)
                .filter(Boolean)
        );

    const products=
        allProducts.filter(
            product=>(!isCop||!!product.pvpCop)&&!selectedProductIds.has(product.id)
        );

    const storeId=
        watch("storeId");

    const { data: kitAvailabilityData } = useKitAvailability(storeId || undefined);

    const kitAvailabilityByProductId = new Map(
        (kitAvailabilityData?.data ?? []).map(item => [item.productId, item.quantity])
    );

    const productId=
        watch(`details.${index}.productId`);

    const {
        data:priceEntriesData
    }=useProductPriceEntries(productId||undefined);

    const priceEntries=
        useOfflineCollection(
            priceEntriesData?.data,
            () => (productId ? getCachedProductPriceEntries(productId) : Promise.resolve([]))
        );

    const priceEntryKey = useWatch({ control, name: "priceEntryKey" });
    const [entryCurrency, entrySequenceRaw] = (priceEntryKey ?? "").split("-");
    const entrySequence = Number(entrySequenceRaw);
    const selectedEntryLabel = priceEntryKey ? `PVP ${entryCurrency} ${entrySequenceRaw}` : undefined;

    const priceForSelectedEntry = productId
        ? priceEntries.find(entry => entry.currency === entryCurrency && entry.sequence === entrySequence)
        : undefined;

    const missingPriceForEntry = !!priceEntryKey && !!productId && !priceForSelectedEntry;

    const{
        data:clientsData
    }=useClients();

    const clients=
        useOfflineCollection(clientsData?.data, () => offlineDb.clients.toArray());

    const clientId=
        watch("clientId");

    const selectedClient=
        clients.find(
            client=>client.id===clientId
        );

    const clientDiscountPercentage=
        Number(selectedClient?.discountPercentage??0);

    const hasClientDiscount=
        clientDiscountPercentage>0;

    const {
        data:marginProfilesData
    }=useMarginProfiles();

    const marginProfiles=
        useOfflineCollection(marginProfilesData?.data, () => offlineDb.marginProfiles.toArray());

    const [selectedProfileId,setSelectedProfileId]=
        useState<string>(NO_PROFILE);

    const hasLineDiscountProfile=
        !hasClientDiscount&&selectedProfileId!==NO_PROFILE;

    const applyClientDiscount=(
        newQuantity:number,
        newUnitPrice:number
    )=>{

        if(hasClientDiscount){
            setValue(
                `details.${index}.discount`,
                newQuantity*newUnitPrice*(clientDiscountPercentage/100)
            );
            return;
        }

        if(hasLineDiscountProfile){

            const profilePercentage=
                Number(
                    marginProfiles.find(profile=>profile.id===selectedProfileId)?.percentage??0
                );

            setValue(
                `details.${index}.discount`,
                newQuantity*newUnitPrice*(profilePercentage/100)
            );

        }

    };

    const quantity=
        Number(
            watch(`details.${index}.quantity`)
        )||0;

    const unitPrice=
        Number(
            watch(`details.${index}.unitPrice`)
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
        unitPrice-
        discount+
        tax;


    return(

        <div className="space-y-3 rounded-lg border p-3">

            <div>

                <Label className="mb-1">Producto</Label>

                <Controller
                    control={control}
                    name={`details.${index}.productId`}
                    render={({field})=>{

                        const items=products.map(product=>{

                            const kitAvailability = kitAvailabilityByProductId.get(product.id);

                            const label = kitAvailability !== undefined
                                ? `${product.internalCode} - ${product.name} (disponible: ${kitAvailability})`
                                : `${product.internalCode} - ${product.name}`;

                            return {
                                value:product.id,
                                label
                            };

                        });

                        const selected=
                            items.find(item=>item.value===field.value)
                            ??null;

                        const handleSelect=(item:{value:string;label:string}|null)=>{

                            field.onChange(item?item.value:"");

                            if(!item){
                                return;
                            }

                            if(priceEntryKey){

                                resolveProductPriceEntries(item.value).then(entries=>{

                                    const match = entries.find(
                                        entry=>entry.currency===entryCurrency&&entry.sequence===entrySequence
                                    );

                                    const newUnitPrice = match
                                        ? Number(match.price)
                                        : undefined;

                                    setValue(`details.${index}.unitPrice`, newUnitPrice);

                                    if(newUnitPrice!==undefined){
                                        applyClientDiscount(quantity,newUnitPrice);
                                    } else {
                                        toast.error(
                                            `${item.label} no tiene precio registrado en "${selectedEntryLabel}". Ingresa el precio manualmente.`
                                        );
                                    }

                                }).catch(error=>{
                                    console.error(error);
                                });

                                return;

                            }

                            const product = allProducts.find(p => p.id === item.value);

                            const priceForCurrency=
                                isCop
                                    ?product?.pvpCop
                                    :product?.pvp;

                            if(priceForCurrency!==undefined&&priceForCurrency!==null){

                                const newUnitPrice=Number(priceForCurrency);

                                setValue(
                                    `details.${index}.unitPrice`,
                                    newUnitPrice
                                );

                                applyClientDiscount(quantity,newUnitPrice);

                            }

                        };

                        return(

                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={handleSelect}
                                onInputValueChange={(text)=>{
                                    const match=matchProductByBarcode(products,text);
                                    if(match){
                                        const matchedItem=items.find(item=>item.value===match.id);
                                        if(matchedItem){
                                            handleSelect(matchedItem);
                                        }
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

            {hasClientDiscount && (
                <p className="text-sm text-muted-foreground">
                    Descuento de cliente ({clientDiscountPercentage}%)
                </p>
            )}

            {priceEntryKey && productId && (

                missingPriceForEntry ? (
                    <p className="text-sm text-red-500">
                        Este producto no tiene precio registrado en "{selectedEntryLabel}". Ingresa el precio manualmente.
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Precio de "{selectedEntryLabel}"{priceForSelectedEntry ? `: ${formatCurrency(Number(priceForSelectedEntry.price), currency)}` : ""}
                    </p>
                )

            )}

            {!hasClientDiscount && (
                <div>
                    <Label className="mb-1">Perfil de descuento (opcional)</Label>
                    <Select
                        value={selectedProfileId}
                        onValueChange={(rawValue)=>{

                            const value=rawValue??NO_PROFILE;

                            setSelectedProfileId(value);

                            const profilePercentage=
                                value!==NO_PROFILE
                                    ?Number(marginProfiles.find(profile=>profile.id===value)?.percentage??0)
                                    :0;

                            setValue(
                                `details.${index}.discount`,
                                quantity*unitPrice*(profilePercentage/100)
                            );

                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sin perfil" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={NO_PROFILE}>Sin perfil</SelectItem>
                            {marginProfiles.map(profile=>(
                                <SelectItem key={profile.id} value={profile.id}>
                                    {profile.name} (-{Number(profile.percentage)}%)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

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
                                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                onChange:(e)=>{
                                    applyClientDiscount(
                                        Number(e.target.value)||0,
                                        unitPrice
                                    );
                                }
                            }
                        )}
                    />

                </div>

                <div>

                    <Label className="mb-1">Precio unit.</Label>

                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...register(
                            `details.${index}.unitPrice`,
                            {
                                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                onChange:(e)=>{
                                    applyClientDiscount(
                                        quantity,
                                        Number(e.target.value)||0
                                    );
                                }
                            }
                        )}
                    />
                    <p className="text-sm text-red-500">
                        {(errors.details as { [key: number]: { unitPrice?: { message?: string } } } | undefined)?.[index]?.unitPrice?.message}
                    </p>

                </div>

                <div>

                    <Label className="mb-1">Descuento</Label>

                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        disabled={hasClientDiscount||hasLineDiscountProfile}
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

            <div className="flex items-center justify-between border-t pt-3">

                <span className="font-medium">
                    Total: {formatCurrency(total,currency)}
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
