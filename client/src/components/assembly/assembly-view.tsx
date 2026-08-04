import { Button } from "@/components/ui/button";
import { AssemblyStatusBadge } from "./assembly-status-badge";
import type { ProductAssembly } from "@/types";

type Props = {
    assembly: ProductAssembly;
    onClose: () => void;
};

export function AssemblyView({ assembly, onClose }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-medium">{assembly.number}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Producto ensamblado</p>
                    <p>{assembly.product.internalCode} - {assembly.product.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <AssemblyStatusBadge status={assembly.status} />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Cantidad producida</p>
                    <p>{Number(assembly.quantity)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p>{new Date(assembly.assemblyDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Registrado por</p>
                    <p>{assembly.user.firstName} {assembly.user.lastName}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Observaciones</p>
                    <p>{assembly.observations ?? "-"}</p>
                </div>
            </div>

            <table className="w-full border rounded-lg">
                <thead>
                    <tr className="border-b bg-muted">
                        <th className="p-2 text-left">Componente consumido</th>
                        <th className="p-2">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {assembly.details.map(detail => (
                        <tr key={detail.id} className="border-b">
                            <td className="p-2">{detail.componentProduct.internalCode} - {detail.componentProduct.name}</td>
                            <td className="p-2 text-center">{Number(detail.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </div>
    );
}
