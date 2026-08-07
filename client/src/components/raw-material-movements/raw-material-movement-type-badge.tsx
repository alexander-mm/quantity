import { Badge } from "@/components/ui/badge";
import type { RawMaterialMovementType } from "@/types";

type Props = {
    type: RawMaterialMovementType;
};

export function RawMaterialMovementTypeBadge({ type }: Props) {

    if (type === "IN") {
        return (
            <Badge className="bg-green-600 hover:bg-green-700">
                Entrada
            </Badge>
        );
    }

    return (
        <Badge className="bg-orange-600 hover:bg-orange-700">
            Salida
        </Badge>
    );

}
