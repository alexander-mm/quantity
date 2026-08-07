import { Badge } from "@/components/ui/badge";
import type { EquipmentPartPreview } from "@/types";

type Props = {
    preview?: EquipmentPartPreview;
    loading?: boolean;
};

function roundUnits(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function EquipmentPartPreviewPanel({ preview, loading }: Props) {

    if (loading) {
        return <p className="text-sm text-muted-foreground">Calculando...</p>;
    }

    if (!preview) {
        return null;
    }

    return (
        <div className="space-y-6">

            <div className="flex flex-wrap gap-2">
                <Badge className={preview.canProduceFromPartStock ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"}>
                    {preview.canProduceFromPartStock
                        ? "Alcanza con el stock de piezas actual"
                        : "Faltan piezas en stock"}
                </Badge>
                {!preview.canProduceFromPartStock && (
                    <Badge className={preview.canProduceWithRawMaterial ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
                        {preview.canProduceWithRawMaterial
                            ? "Alcanza consiguiendo las piezas faltantes de materia prima"
                            : "Falta materia prima para cubrir las piezas faltantes"}
                    </Badge>
                )}
            </div>

            <div>
                <p className="mb-2 font-medium">Piezas necesarias</p>
                <table className="w-full border rounded-lg text-sm">
                    <thead>
                        <tr className="border-b bg-muted">
                            <th className="p-2 text-left">Pieza</th>
                            <th className="p-2">Requerido</th>
                            <th className="p-2">Disponible</th>
                            <th className="p-2">Faltante</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preview.parts.map(item => (
                            <tr key={item.partId} className="border-b last:border-b-0">
                                <td className="p-2">{item.partName}</td>
                                <td className="p-2 text-center">{item.requiredQuantity}</td>
                                <td className="p-2 text-center">{item.available}</td>
                                <td className={`p-2 text-center ${item.sufficient ? "text-muted-foreground" : "font-medium text-red-500"}`}>
                                    {item.missing}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {preview.parts.some(item => item.rawMaterial) && (
                <div>
                    <p className="mb-2 font-medium">Materia prima necesaria para las piezas faltantes</p>
                    <table className="w-full border rounded-lg text-sm">
                        <thead>
                            <tr className="border-b bg-muted">
                                <th className="p-2 text-left">Materia prima</th>
                                <th className="p-2">Unidades requeridas</th>
                                <th className="p-2">Disponible</th>
                                <th className="p-2">Faltante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preview.parts.filter(item => item.rawMaterial).map(item => (
                                <tr key={item.partId} className="border-b last:border-b-0">
                                    <td className="p-2">
                                        {item.rawMaterial!.rawMaterialName}
                                        <span className="block text-xs text-muted-foreground">para {item.partName}</span>
                                    </td>
                                    <td className="p-2 text-center">{roundUnits(item.rawMaterial!.unitsRequired)}</td>
                                    <td className="p-2 text-center">{roundUnits(item.rawMaterial!.unitsAvailable)}</td>
                                    <td className={`p-2 text-center ${item.rawMaterial!.unitsMissing === 0 ? "text-muted-foreground" : "font-medium text-red-500"}`}>
                                        {roundUnits(item.rawMaterial!.unitsMissing)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {preview.parts.some(item => !item.sufficient && !item.rawMaterial) && (
                <p className="text-sm text-amber-600">
                    Algunas piezas faltantes no tienen una receta de corte definida, así que no se puede calcular
                    cuánta materia prima hace falta para ellas. Defínela en "RECETAS DE CORTE".
                </p>
            )}

        </div>
    );

}
