import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export function RawMaterialMovementHeader() {

    const {
        register,
        control,
        formState: { errors }
    } = useFormContext();

    return (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
                <Label>Número</Label>
                <Input {...register("number")} />
                <p className="text-sm text-red-500">
                    {errors.number?.message as string}
                </p>
            </div>

            <div>
                <Label>Tipo de movimiento</Label>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IN">Entrada (compra)</SelectItem>
                                <SelectItem value="OUT">Salida (consumo)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.type?.message as string}
                </p>
            </div>

            <div>
                <Label>Fecha</Label>
                <Input type="date" {...register("movementDate")} />
                <p className="text-sm text-red-500">
                    {errors.movementDate?.message as string}
                </p>
            </div>

            <div>
                <Label>Observaciones (opcional)</Label>
                <Input {...register("observations")} />
            </div>

        </div>

    );

}
