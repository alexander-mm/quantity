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
import { Button } from "@/components/ui/button";
import { useProducts, useProductPrices } from "@/hooks";

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

    const products=
        productsData?.data??[];

    const productId=
        watch(`details.${index}.productId`);

    const {
        data:pricesData
    }=useProductPrices(productId||undefined);

    const prices=
        pricesData?.data??[];

    const [
        marginProfileId,
        setMarginProfileId
    ]=useState("");

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

        <tr className="border-b">

            <td className="p-2 min-w-72">

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

            </td>

            <td className="p-2 min-w-52">

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

                            setValue(
                                `details.${index}.unitPrice`,
                                Number(selected.price)
                            );

                        }

                    }}
                    disabled={!productId||prices.length===0}
                >

                    <SelectTrigger>

                        <SelectValue
                            placeholder="Perfil"
                        />

                    </SelectTrigger>

                    <SelectContent>

                        {
                            prices.map(price=>(

                                <SelectItem
                                    key={price.marginProfileId}
                                    value={price.marginProfileId}
                                >
                                    {price.marginProfileName} ({Number(price.marginProfilePercentage)}%) - ${Number(price.price).toFixed(2)}
                                </SelectItem>

                            ))
                        }

                    </SelectContent>

                </Select>

            </td>

            <td className="p-2 w-28">

                <Input
                    type="number"
                    min={0}
                    step="1"
                    {...register(
                        `details.${index}.quantity`,
                        {
                            valueAsNumber:true
                        }
                    )}
                />

            </td>

            <td className="p-2 w-32">

                <Input
                    type="number"
                    min={0}
                    step="1"
                    {...register(
                        `details.${index}.unitPrice`,
                        {
                            valueAsNumber:true
                        }
                    )}
                />

            </td>

            <td className="p-2 w-28">

                <Input
                    type="number"
                    min={0}
                    step="1"
                    {...register(
                        `details.${index}.discount`,
                        {
                            valueAsNumber:true
                        }
                    )}
                />

            </td>

            <td className="p-2 w-28">

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

            </td>

            <td className="p-2 w-32 font-medium">

                $
                {total.toFixed(2)}

            </td>

            <td className="p-2 w-16 text-center">

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

            </td>

        </tr>

    );

}
