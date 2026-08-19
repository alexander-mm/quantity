import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { InventoryMovementForm } from "./inventory-movement-form";
import type { InventoryMovement } from "@/types";

type Props={
    open:boolean;
    movement?: InventoryMovement | null;
    onOpenChange:(open:boolean)=>void;
};

export function InventoryMovementModal({
    open,
    movement,
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
                        {movement ? `Editar movimiento` : "Nuevo movimiento"}
                    </DialogTitle>
                </DialogHeader>

                <InventoryMovementForm
                    key={movement?.id ?? "new"}
                    movement={movement}
                    onSuccess={()=>{
                        onOpenChange(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );

}