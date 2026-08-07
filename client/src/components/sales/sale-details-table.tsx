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
            <div className="space-y-3">
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

            </div>

            <Button
                type="button"
                variant="outline"
                onClick={()=>append({

                    productId:"",
                    quantity:undefined,
                    unitPrice:undefined,
                    discount:undefined,
                    tax:undefined

                })}
            >
                <Plus size={18}/>
                Agregar producto
            </Button>
        </div>
    );
}
