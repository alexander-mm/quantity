import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useWatch, type Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
    control: Control<any>;
    register: any;
    setValue: any;
    name: string;
    label: string;
    errorMessage?: string;
};

export function VoucherList({ control, register, setValue, name, label, errorMessage }: Props) {

    const vouchers: string[] = useWatch({ control, name }) ?? [];

    return (
        <div>
            <Label className="mb-1">{label}</Label>

            <div className="space-y-2">
                {vouchers.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            {...register(`${name}.${index}` as const)}
                            placeholder="Número de comprobante"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setValue(
                                name,
                                vouchers.filter((_, i) => i !== index)
                            )}
                        >
                            <Trash2 size={16} className="text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setValue(name, [...vouchers, ""])}
            >
                <Plus size={16} />
                Agregar comprobante
            </Button>

            <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
    );

}

// Variante conveniente para formularios que ya están dentro de un FormProvider
// (usa useFormContext en vez de recibir control/register/setValue por props).
export function VoucherListFromContext({
    name,
    label
}: {
    name: string;
    label: string;
}) {

    const { control, register, setValue, formState: { errors } } = useFormContext();

    const errorMessage =
        (errors[name] as { message?: string } | undefined)?.message;

    return (
        <VoucherList
            control={control}
            register={register}
            setValue={setValue}
            name={name}
            label={label}
            errorMessage={errorMessage}
        />
    );

}
