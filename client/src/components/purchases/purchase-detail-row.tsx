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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks";
import { getProductById } from "@/services";

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
        setValue
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

                                    if(!item){
                                        return;
                                    }

                                    getProductById(item.value).then(response=>{

                                        const product=response.data;

                                        setValue(
                                            `details.${index}.unitCost`,
                                            Number(product.costPrice)
                                        );

                                        setValue(
                                            `details.${index}.pvp`,
                                            Number(product.pvp)
                                        );

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
                                valueAsNumber:true
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
                        {...register(
                            `details.${index}.unitCost`,
                            {
                                valueAsNumber:true
                            }
                        )}
                    />

                </div>

                <div>

                    <Label className="mb-1">PVP</Label>

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

                </div>

                <div>

                    <Label className="mb-1">Descuento</Label>

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
