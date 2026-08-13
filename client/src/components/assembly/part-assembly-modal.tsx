import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { PartAssemblyForm } from "./part-assembly-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    assemblyId?: string;
};

export function PartAssemblyModal({ open, onOpenChange, mode = "create", assemblyId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Ensamblar pieza" : "Editar ensamblaje"}
                    </DialogTitle>
                </DialogHeader>
                <PartAssemblyForm
                    mode={mode}
                    assemblyId={assemblyId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}