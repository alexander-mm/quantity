import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewUnit: () => void;
};

export function UnitsOfMeasureToolbar({ onNewUnit }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewUnit}>
                <Plus size={18} />
                Nueva unidad
            </Button>
        </div>
    );
}
