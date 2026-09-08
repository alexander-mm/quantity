import { Label } from "@/components/ui/label";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import type { MarginProfile } from "@/types";

type NoneOption = {
    value: string;
    label: string;
};

type Props = {
    marginProfiles: MarginProfile[];
    value: string;
    label?: string;
    placeholder?: string;
    onChange: (value: string | null) => void;
    // Item extra (ej. "Sin perfil" / "Precio base") para representar "ninguno".
    noneOption?: NoneOption;
};

function formatProfileLabel(profile: MarginProfile) {
    return `${profile.name} (-${Number(profile.percentage)}%)`;
}

export function MarginProfileSelector({
    marginProfiles,
    value,
    label = "Perfil de descuento",
    placeholder = "Seleccione un perfil",
    onChange,
    noneOption
}: Props) {

    const items = [
        ...(noneOption ? [noneOption] : []),
        ...marginProfiles.map(profile => ({ value: profile.id, label: formatProfileLabel(profile) }))
    ];

    const selected = items.find(item => item.value === value) ?? null;

    return (
        <div className="flex-1">
            {label && <Label className="mb-1">{label}</Label>}
            <Combobox
                items={items}
                value={selected}
                onValueChange={(item) => onChange(item ? item.value : "")}
            >
                <ComboboxInput placeholder={placeholder} />
                <ComboboxContent>
                    {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxContent>
                <ComboboxEmpty>
                    No se encontraron perfiles.
                </ComboboxEmpty>
            </Combobox>
        </div>
    );
}
