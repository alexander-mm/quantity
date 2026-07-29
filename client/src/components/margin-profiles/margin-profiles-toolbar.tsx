import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewProfile: () => void;
};

export function MarginProfilesToolbar({ onNewProfile }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewProfile}>
                <Plus size={18} />
                Nuevo perfil
            </Button>
        </div>
    );
}
