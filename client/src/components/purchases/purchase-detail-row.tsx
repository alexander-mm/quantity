import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks";

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
        watch
    }=useFormContext();

    const{
        data:productsData
    }=useProducts();

    const products=
        productsData?.data??[];
        
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
                                onValueChange={(item)=>
                                    field.onChange(item?item.value:"")
                                }
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
                        `details.${index}.unitCost`,
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
                    step="0.01"
                    {...register(
                        `details.${index}.pvp`,
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