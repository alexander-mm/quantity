import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { setEquipmentPartsSchema } from "@/validators";
import type { SetEquipmentPartsFormData } from "@/validators";
import { useEquipmentParts, useSetEquipmentParts } from "@/hooks";
import { EquipmentPartRow } from "./equipment-part-row";

type Props = {
    productId: string;
};

export function EquipmentPartEditor({ productId }: Props) {

    const { data: equipmentPartsData } = useEquipmentParts(productId);
    const setMutation = useSetEquipmentParts();

    const methods = useForm<SetEquipmentPartsFormData>({
        resolver: zodResolver(setEquipmentPartsSchema),
        defaultValues: {
            parts: []
        }
    });

    const { control, handleSubmit, reset } = methods;
    const { fields, append, remove } = useFieldArray({ control, name: "parts" });

    useEffect(() => {

        const items = equipmentPartsData?.data ?? [];

        reset({
            parts: items.map(item => ({
                partId: item.partId,
                quantity: Number(item.quantity)
            }))
        });

    }, [equipmentPartsData, reset]);

    const onSubmit = (data: SetEquipmentPartsFormData) => {

        setMutation.mutate({
            productId,
            data: {
                parts: data.parts
                    .filter(item => item.partId)
                    .map(item => ({ partId: item.partId, quantity: Number(item.quantity) }))
            }
        }, {
            onSuccess: () => {
                toast.success("Receta de piezas guardada correctamente.");
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo guardar la receta de piezas.";
                toast.error(message);
            }
        });

    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate className="space-y-4">

                <div className="space-y-3">
                    {fields.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Este equipo aún no tiene piezas asignadas.
                        </p>
                    )}
                    {fields.map((field, index) => (
                        <EquipmentPartRow
                            key={field.id}
                            index={index}
                            onRemove={() => remove(index)}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ partId: "", quantity: undefined })}
                    >
                        <Plus size={18} />
                        Agregar pieza
                    </Button>

                    <Button type="submit" disabled={setMutation.isPending}>
                        {setMutation.isPending ? "Guardando..." : "Guardar receta"}
                    </Button>
                </div>

            </form>
        </FormProvider>
    );

}
