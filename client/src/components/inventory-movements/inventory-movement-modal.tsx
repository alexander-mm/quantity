import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { InventoryMovementForm } from "./inventory-movement-form";

type Props={
    open:boolean;
    onOpenChange:(open:boolean)=>void;
};

export function InventoryMovementModal({
    open,
    onOpenChange
}:Props){

    return(
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Nuevo movimiento
                    </DialogTitle>
                </DialogHeader>

                <InventoryMovementForm
                    onSuccess={()=>{
                        onOpenChange(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );

}