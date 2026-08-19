import { Label } from "@/components/ui/label";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import type { Client } from "@/types";

type Props={
    clients:Client[];
    value:string;
    label?:string;
    placeholder?:string;
    onChange:(value:string|null)=>void;
};

function getClientLabel(client:Client){
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || client.document);
}

export function ClientSelector({
    clients,
    value,
    label="Cliente",
    placeholder="Seleccione un cliente",
    onChange
}:Props){

    const items = clients.map(client => ({
        value: client.id,
        label: `${getClientLabel(client)} - ${client.document}`
    }));

    const selected = items.find(item => item.value === value) ?? null;

    return(
        <div className="flex-1">
            <Label className="mb-1">{label}</Label>
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
                    No se encontraron clientes.
                </ComboboxEmpty>
            </Combobox>
        </div>
    );
}
