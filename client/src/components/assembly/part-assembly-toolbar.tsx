import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewAssembly: () => void;
};

export function PartAssemblyToolbar({ onNewAssembly }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewAssembly}>
                <Plus size={18} />
                Ensamblar pieza
            </Button>
        </div>
    );
}