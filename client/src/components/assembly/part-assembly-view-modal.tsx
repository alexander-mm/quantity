import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { PartAssembly } from "@/types";
import { PartAssemblyView } from "./part-assembly-view";

type Props = {
    open: boolean;
    assembly: PartAssembly | null;
    onOpenChange: (open: boolean) => void;
};

export function PartAssemblyViewModal({ open, assembly, onOpenChange }: Props) {

    if (!assembly) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de ensamblaje</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Ensamblaje #{assembly.number}
                    </p>
                </DialogHeader>
                <PartAssemblyView
                    assembly={assembly}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}