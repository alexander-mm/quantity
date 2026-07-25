import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SaleDetailRow } from "./sale-detail-row";

export function SaleDetailsTable(){

    const{
        control
    }=useFormContext();

    const{
        fields,
        append,
        remove
    }=useFieldArray({
        control,
        name:"details"
    });

    return(

        <div className="space-y-4">

            <div className="overflow-x-auto rounded-lg border">

                <table className="w-full">

                    <thead className="bg-muted/40">

                        <tr>

                            <th className="p-3 text-left">
                                Producto
                            </th>

                            <th className="p-3 text-left">
                                Perfil
                            </th>

                            <th className="p-3 text-left">
                                Cantidad
                            </th>

                            <th className="p-3 text-left">
                                Precio unit.
                            </th>

                            <th className="p-3 text-left">
                                Desc.
                            </th>

                            <th className="p-3 text-left">
                                IVA
                            </th>

                            <th className="p-3 text-left">
                                Total
                            </th>

                            <th className="w-16"/>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            fields.map((field,index)=>(

                                <SaleDetailRow
                                    key={field.id}
                                    index={index}
                                    onRemove={()=>
                                        remove(index)
                                    }
                                />

                            ))
                        }

                    </tbody>

                </table>

            </div>

            <Button
                type="button"
                variant="outline"
                onClick={()=>append({

                    productId:"",
                    quantity:1,
                    unitPrice:0,
                    discount:0,
                    tax:0

                })}
            >

                <Plus size={18}/>

                Agregar producto

            </Button>

        </div>

    );

}
