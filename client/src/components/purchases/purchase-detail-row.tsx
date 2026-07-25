import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
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
                    render={({field})=>(

                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >

                            <SelectTrigger>

                                <SelectValue
                                    placeholder="Producto"
                                />

                            </SelectTrigger>

                            <SelectContent>

                                {
                                    products.map(product=>(

                                        <SelectItem
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </SelectItem>

                                    ))
                                }

                            </SelectContent>

                        </Select>

                    )}
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