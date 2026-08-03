import type { Client } from "@/types";

export function getClientLabel(client: Client) {
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || client.document);
}
