import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Role } from "@/types";

type Props = {
    roles: Role[];
    value: string;
    label?: string;
    placeholder?: string;
    onChange: (value: string | null) => void;
};

export function RoleSelector({
    roles,
    value,
    label = "Rol",
    placeholder = "Seleccione un rol",
    onChange
}: Props) {
    return (
        <div className="flex-1">
            <Label>{label}</Label>
            <Select
                value={value}
                onValueChange={onChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {
                        roles.map(role => (
                            <SelectItem
                                key={role.id}
                                value={role.id}
                            >
                                {role.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
    );
}
