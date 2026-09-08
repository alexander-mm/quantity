import { Label } from "@/components/ui/label";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import type { User } from "@/types";

type Props = {
    users: User[];
    value: string;
    label?: string;
    placeholder?: string;
    emptyMessage?: string;
    onChange: (value: string | null) => void;
};

export function UserSelector({
    users,
    value,
    label = "Usuario",
    placeholder = "Seleccione un usuario",
    emptyMessage = "No se encontraron usuarios.",
    onChange
}: Props) {

    const items = users.map(user => ({ value: user.id, label: `${user.firstName} ${user.lastName}` }));
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
                    {emptyMessage}
                </ComboboxEmpty>
            </Combobox>
        </div>
    );
}
