import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewAdjustment: () => void;
};

export function InventoryAdjustmentsToolbar({ onNewAdjustment }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewAdjustment}>
                <Plus size={18} />
                Nuevo ajuste
            </Button>
        </div>
    );
}
