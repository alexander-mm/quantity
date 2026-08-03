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
                    quantity:1,
                    unitCost:0,
                    pvp:0,
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
