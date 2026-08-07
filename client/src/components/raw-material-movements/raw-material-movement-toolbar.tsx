import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewMovement: () => void;
};

export function RawMaterialMovementToolbar({ onNewMovement }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewMovement}>
                <Plus size={18} />
                Registrar movimiento
            </Button>
        </div>
    );
}
