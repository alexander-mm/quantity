import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
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
import { useProducts, useProductPrices, useClients } from "@/hooks";
import { getProductById } from "@/services";
import { formatCurrency } from "@/lib/format-currency";

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
        setValue
    }=useFormContext();

    const{
        data:productsData
    }=useProducts();

    const currency=
        watch("currency");

    const isCop=
        currency==="COP";

    const products=
        (productsData?.data??[]).filter(
            product=>!isCop||!!product.pvpCop
        );

    const productId=
        watch(`details.${index}.productId`);

    const {
        data:pricesData
    }=useProductPrices(productId||undefined);

    const prices=
        (pricesData?.data??[]).filter(
            price=>!isCop||!!price.priceCop
        );

    const [
        marginProfileId,
        setMarginProfileId
    ]=useState("");

    const{
        data:clientsData
    }=useClients();

    const clientId=
        watch("clientId");

    const selectedClient=
        (clientsData?.data??[]).find(
            client=>client.id===clientId
        );

    const clientDiscountPercentage=
        Number(selectedClient?.discountPercentage??0);

    const hasClientDiscount=
        clientDiscountPercentage>0;

    const applyClientDiscount=(
        newQuantity:number,
        newUnitPrice:number
    )=>{

        if(!hasClientDiscount){
            return;
        }

        setValue(
            `details.${index}.discount`,
            newQuantity*newUnitPrice*(clientDiscountPercentage/100)
        );

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

                        const items=products.map(product=>({
                            value:product.id,
                            label:`${product.internalCode} - ${product.name}`
                        }));

                        const selected=
                            items.find(item=>item.value===field.value)
                            ??null;

                        return(

                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={(item)=>{

                                    field.onChange(item?item.value:"");
                                    setMarginProfileId("");

                                    if(!item){
                                        return;
                                    }

                                    getProductById(item.value).then(response=>{

                                        const product=response.data;

                                        const priceForCurrency=
                                            isCop
                                                ?product.pvpCop
                                                :product.pvp;

                                        if(priceForCurrency!==undefined&&priceForCurrency!==null){

                                            const newUnitPrice=Number(priceForCurrency);

                                            setValue(
                                                `details.${index}.unitPrice`,
                                                newUnitPrice
                                            );

                                            applyClientDiscount(quantity,newUnitPrice);

                                        }

                                    }).catch(error=>{
                                        console.error(error);
                                    });

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

            <div>

                {hasClientDiscount ? (

                    <p className="text-sm text-muted-foreground">
                        Descuento de cliente ({clientDiscountPercentage}%)
                    </p>

                ) : (

                    <>

                        <Label className="mb-1">Perfil</Label>

                        <Select
                            value={marginProfileId}
                            onValueChange={(value)=>{

                                if(!value){
                                    return;
                                }

                                setMarginProfileId(value);

                                const selected=
                                    prices.find(
                                        price=>price.marginProfileId===value
                                    );

                                if(selected){

                                    const priceForCurrency=
                                        isCop
                                            ?selected.priceCop
                                            :selected.price;

                                    setValue(
                                        `details.${index}.unitPrice`,
                                        Number(priceForCurrency)
                                    );

                                }

                            }}
                            disabled={!productId||prices.length===0}
                        >

                            <SelectTrigger className="w-full">

                                <SelectValue
                                    placeholder="Perfil"
                                />

                            </SelectTrigger>

                            <SelectContent>

                                {
                                    prices.map(price=>{

                                        const displayPrice=
                                            isCop
                                                ?price.priceCop
                                                :price.price;

                                        return(

                                            <SelectItem
                                                key={price.marginProfileId}
                                                value={price.marginProfileId}
                                            >
                                                {price.marginProfileName} ({Number(price.marginProfilePercentage)}%) - {formatCurrency(displayPrice??0,currency)}
                                            </SelectItem>

                                        );

                                    })
                                }

                            </SelectContent>

                        </Select>

                    </>

                )}

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div>

                    <Label className="mb-1">Cantidad</Label>

                    <Input
                        type="number"
                        min={0}
                        step="1"
                        {...register(
                            `details.${index}.quantity`,
                            {
                                valueAsNumber:true,
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
                        {...register(
                            `details.${index}.unitPrice`,
                            {
                                valueAsNumber:true,
                                onChange:(e)=>{
                                    applyClientDiscount(
                                        quantity,
                                        Number(e.target.value)||0
                                    );
                                }
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
                        disabled={hasClientDiscount}
                        {...register(
                            `details.${index}.discount`,
                            {
                                valueAsNumber:true
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
                        {...register(
                            `details.${index}.tax`,
                            {
                                valueAsNumber:true
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
