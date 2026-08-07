import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PurchaseDetailRow } from "./purchase-detail-row";

export function PurchaseDetailsTable(){

    const{ control }=useFormContext();
    const{ fields, append, remove }=useFieldArray({ control, name:"details" });

    return(
        <div className="space-y-4">

            <div className="space-y-3">
                {
                    fields.map((field,index)=>(
                        <PurchaseDetailRow
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
                    unitCost:undefined,
                    pvp:0,
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
