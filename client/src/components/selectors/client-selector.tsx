import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    return(
        <div className="flex-1">
            <Label className="mb-1">{label}</Label>
            <Select
                value={value}
                onValueChange={onChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent>
                    {
                        clients.map(client=>(
                            <SelectItem
                                key={client.id}
                                value={client.id}
                            >
                                {getClientLabel(client)} - {client.document}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
    );
}
