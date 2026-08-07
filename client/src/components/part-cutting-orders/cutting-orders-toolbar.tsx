import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewOrder: () => void;
};

export function CuttingOrdersToolbar({ onNewOrder }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewOrder}>
                <Plus size={18} />
                Registrar orden de corte
            </Button>
        </div>
    );
}
