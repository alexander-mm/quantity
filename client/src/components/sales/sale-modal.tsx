import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { SaleForm } from "./sale-form";

type Props={
    open:boolean;
    onOpenChange:(open:boolean)=>void;
};

export function SaleModal({
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
                        Nueva venta
                    </DialogTitle>

                </DialogHeader>

                <SaleForm
                    onSuccess={()=>{
                        onOpenChange(false);
                    }}
                />

            </DialogContent>

        </Dialog>

    );

}
