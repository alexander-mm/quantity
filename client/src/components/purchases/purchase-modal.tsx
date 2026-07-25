import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { PurchaseForm } from "./purchase-form";

type Props={
    open:boolean;
    onOpenChange:(open:boolean)=>void;
};

export function PurchaseModal({
    open,
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
                        Nueva compra
                    </DialogTitle>

                </DialogHeader>

                <PurchaseForm
                    onSuccess={()=>{
                        onOpenChange(false);
                    }}
                />

            </DialogContent>

        </Dialog>

    );

}