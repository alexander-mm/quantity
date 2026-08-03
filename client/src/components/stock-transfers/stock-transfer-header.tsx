import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoreSelector } from "@/components/selectors/store-selector";
import { useStores, useUsers } from "@/hooks";
import { ROLES } from "@/constants/roles";

export function StockTransferHeader() {

    const { register, control, formState: { errors } } = useFormContext();
    const { data: storesData } = useStores();
    const { data: usersData } = useUsers();

    const stores = storesData?.data ?? [];
    const technicians = (usersData?.data ?? []).filter(u => u.role.name === ROLES.TECHNICIAN);

    const originStoreId = useWatch({ control, name: "originStoreId" });
    const destType = useWatch({ control, name: "destType" });

    const destStores = stores.filter(s => s.id !== originStoreId);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
                <Label>Número</Label>
                <Input {...register("number")} />
                <p className="text-sm text-red-500">{errors.number?.message as string}</p>
            </div>

            <div>
                <Label>Fecha de despacho</Label>
                <Input type="date" {...register("dispatchDate")} />
                <p className="text-sm text-red-500">{errors.dispatchDate?.message as string}</p>
            </div>

            <div>
                <Controller
                    control={control}
                    name="originStoreId"
                    render={({ field }) => (
                        <StoreSelector
                            stores={stores}
                            value={field.value}
                            label="Origen"
                            onChange={(value) => field.onChange(value ?? "")}
                        />
                    )}
                />
                <p className="text-sm text-red-500">{errors.originStoreId?.message as string}</p>
            </div>

            <div>
                <Label>Tipo de destino</Label>
                <Controller
                    control={control}
                    name="destType"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="STORE">Tienda / Bodega</SelectItem>
                                <SelectItem value="TECHNICIAN">Técnico</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {destType === "TECHNICIAN" ? (
                <div>
                    <Label>Técnico</Label>
                    <Controller
                        control={control}
                        name="destUserId"
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un técnico" />
                                </SelectTrigger>
                                <SelectContent>
                                    {technicians.map(t => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.firstName} {t.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className="text-sm text-red-500">{errors.destUserId?.message as string}</p>
                </div>
            ) : (
                <div>
                    <Controller
                        control={control}
                        name="destStoreId"
                        render={({ field }) => (
                            <StoreSelector
                                stores={destStores}
                                value={field.value ?? ""}
                                label="Destino"
                                onChange={(value) => field.onChange(value ?? "")}
                            />
                        )}
                    />
                    <p className="text-sm text-red-500">{errors.destStoreId?.message as string}</p>
                </div>
            )}

            <div className="md:col-span-2">
                <Label>Observaciones</Label>
                <Input {...register("observations")} />
            </div>

        </div>
    );
}
