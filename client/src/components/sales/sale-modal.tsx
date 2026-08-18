import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { SaleForm } from "./sale-form";
import type { Sale } from "@/types";

type Props={
    open:boolean;
    sale?: Sale | null;
    onOpenChange:(open:boolean)=>void;
};

export function SaleModal({
    open,
    sale,
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
                        {sale ? `Editar venta ${sale.number}` : "Nueva venta"}
                    </DialogTitle>

                </DialogHeader>

                <SaleForm
                    key={sale?.id ?? "new"}
                    sale={sale}
                    onSuccess={()=>{
                        onOpenChange(false);
                    }}
                />

            </DialogContent>

        </Dialog>

    );

}
