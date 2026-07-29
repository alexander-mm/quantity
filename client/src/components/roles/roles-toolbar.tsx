import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewRole: () => void;
};

export function RolesToolbar({ onNewRole }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewRole}>
                <Plus size={18} />
                Nuevo rol
            </Button>
        </div>
    );
}