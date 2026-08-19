import { Badge } from "@/components/ui/badge";
import type { PartProductionPreview as PartProductionPreviewType } from "@/types";
import { PartProductionNode } from "./part-production-node";

type Props = {
    preview?: PartProductionPreviewType;
    loading?: boolean;
};

export function PartProductionPreview({ preview, loading }: Props) {

    if (loading) {
        return <p className="text-sm text-muted-foreground">Calculando...</p>;
    }

    if (!preview) {
        return null;
    }

    return (
        <div className="space-y-4">

            <Badge className={preview.resolvable ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
                {preview.resolvable
                    ? "Se puede producir con lo disponible o consiguiendo lo faltante"
                    : "No es posible producir esta cantidad con las recetas y el stock actuales"}
            </Badge>

            <div>
                <p className="mb-2 font-medium">Piezas y productos necesarios</p>
                <div className="rounded-lg border p-3">
                    <PartProductionNode node={preview.tree} depth={0} />
                </div>
            </div>

        </div>
    );

}
