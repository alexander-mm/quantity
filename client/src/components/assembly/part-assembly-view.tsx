import { Button } from "@/components/ui/button";
import { AssemblyStatusBadge } from "./assembly-status-badge";
import type { PartAssembly } from "@/types";

type Props = {
    assembly: PartAssembly;
    onClose: () => void;
};

export function PartAssemblyView({ assembly, onClose }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-medium">{assembly.number}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Pieza ensamblada</p>
                    <p>{assembly.part.code} - {assembly.part.name}</p>
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

            {assembly.details.length > 0 && (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted">
                                <th className="p-2 text-left">Pieza consumida</th>
                                <th className="p-2">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assembly.details.map(detail => (
                                <tr key={detail.id} className="border-b">
                                    <td className="p-2 whitespace-nowrap">{detail.componentPart.code} - {detail.componentPart.name}</td>
                                    <td className="p-2 text-center">{Number(detail.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {assembly.productDetails.length > 0 && (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted">
                                <th className="p-2 text-left">Producto consumido</th>
                                <th className="p-2">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assembly.productDetails.map(detail => (
                                <tr key={detail.id} className="border-b">
                                    <td className="p-2 whitespace-nowrap">{detail.componentProduct.internalCode} - {detail.componentProduct.name}</td>
                                    <td className="p-2 text-center">{Number(detail.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </div>
    );
}