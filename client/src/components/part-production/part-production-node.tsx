import type { PartProductionNode as PartProductionNodeType } from "@/types";

type Props = {
    node: PartProductionNodeType;
    depth: number;
};

function roundUnits(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function PartProductionNode({ node, depth }: Props) {

    const showOwnStock = depth > 0;

    return (
        <div className={depth > 0 ? "mt-2 border-l pl-4" : ""}>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">{node.partCode} - {node.partName}</span>
                <span className={node.resolvable ? "text-muted-foreground" : "font-medium text-red-500"}>
                    {showOwnStock
                        ? `${roundUnits(node.requiredQuantity)} requerido / ${roundUnits(node.available)} disponible / ${roundUnits(node.missing)} faltante`
                        : `${roundUnits(node.requiredQuantity)} a producir`}
                </span>
            </div>

            {node.circular && (
                <p className="mt-1 text-xs text-amber-600">
                    Referencia circular detectada en la receta: esta pieza ya aparece como componente de sí misma más arriba en el árbol.
                </p>
            )}

            {node.missing > 0 && node.rawMaterial && (
                <div className="mt-2 rounded-md bg-muted/50 p-2 text-xs">
                    <p className="font-medium">Opción: cortar de materia prima</p>
                    <p>
                        {node.rawMaterial.rawMaterialName}: {roundUnits(node.rawMaterial.unitsRequired)} unidades requeridas
                        / {roundUnits(node.rawMaterial.unitsAvailable)} disponibles
                        {" "}
                        <span className={node.rawMaterial.unitsMissing === 0 ? "text-muted-foreground" : "font-medium text-red-500"}>
                            ({roundUnits(node.rawMaterial.unitsMissing)} faltante)
                        </span>
                    </p>
                </div>
            )}

            {node.missing > 0 && node.hasAssemblyOption && (
                <div className="mt-2 text-xs">
                    <p className="font-medium">
                        {node.hasRawMaterialOption ? "Opción: armar con componentes" : "Se arma con"}
                    </p>

                    {node.subParts.map(child => (
                        <PartProductionNode key={child.partId} node={child} depth={depth + 1} />
                    ))}

                    {node.subProducts.map(item => (
                        <div key={item.componentProductId} className="mt-2 border-l pl-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span>{item.componentCode} - {item.componentName}</span>
                                <span className={item.sufficient ? "text-muted-foreground" : "font-medium text-red-500"}>
                                    {roundUnits(item.requiredQuantity)} requerido / {roundUnits(item.available)} disponible
                                    / {roundUnits(item.missing)} faltante
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {node.missing > 0 && !node.hasRawMaterialOption && !node.hasAssemblyOption && !node.circular && (
                <p className="mt-1 text-xs text-amber-600">
                    Falta stock y esta pieza no tiene receta de corte ni de ensamblaje definida.
                </p>
            )}

        </div>
    );

}
