import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { AssemblyForm } from "./assembly-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    assemblyId?: string;
};

export function AssemblyModal({ open, onOpenChange, mode = "create", assemblyId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Ensamblar producto" : "Editar ensamblaje"}
                    </DialogTitle>
                </DialogHeader>
                <AssemblyForm
                    mode={mode}
                    assemblyId={assemblyId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
