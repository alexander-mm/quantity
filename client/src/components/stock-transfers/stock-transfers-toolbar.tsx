import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { onNewTransfer: () => void; };

export function StockTransfersToolbar({ onNewTransfer }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewTransfer}>
                <Plus size={18} />
                Nuevo envío
            </Button>
        </div>
    );
}
