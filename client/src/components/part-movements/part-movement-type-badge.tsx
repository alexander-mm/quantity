import { Badge } from "@/components/ui/badge";
import type { PartMovementType } from "@/types";

type Props = {
    type: PartMovementType;
};

export function PartMovementTypeBadge({ type }: Props) {

    if (type === "IN") {
        return (
            <Badge className="bg-green-600 hover:bg-green-700">
                Carga
            </Badge>
        );
    }

    return (
        <Badge className="bg-orange-600 hover:bg-orange-700">
            Descarga
        </Badge>
    );

}
