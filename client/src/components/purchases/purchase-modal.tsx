import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { PurchaseForm } from "./purchase-form";
import type { Purchase } from "@/types";

type Props={
    open:boolean;
    purchase?: Purchase | null;
    onOpenChange:(open:boolean)=>void;
};

export function PurchaseModal({
    open,
    purchase,
    onOpenChange
}:Props){

    return(

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-6xl">

                <DialogHeader>

                    <DialogTitle>
                        {purchase ? `Editar compra ${purchase.number}` : "Nueva compra"}
                    </DialogTitle>

                </DialogHeader>

                <PurchaseForm
                    key={purchase?.id ?? "new"}
                    purchase={purchase}
                    onSuccess={()=>{
                        onOpenChange(false);
                    }}
                />

            </DialogContent>

        </Dialog>

    );

}
