import axios from "axios";
import { api } from "@/services/api";
import { queryClient } from "@/app/providers/query-provider";
import { offlineDb, type OutboxItem } from "./dexie";

export function isNetworkError(error: unknown): boolean {
    return axios.isAxiosError(error) && !error.response;
}

type EnqueueInput = Pick<OutboxItem, "id" | "entity" | "operation" | "method" | "endpoint" | "payload" | "storeId" | "userId">;

export async function enqueueOutboxItem(item: EnqueueInput): Promise<void> {

    const now = Date.now();

    await offlineDb.outbox.put({
        ...item,
        status: "pending",
        attempts: 0,
        createdAt: now,
        updatedAt: now
    });

}

const ENTITY_QUERY_KEYS: Record<string, string[]> = {
    sale: ["sales"]
};

let processingInFlight: Promise<void> | null = null;

export function processOutbox(): Promise<void> {

    if (processingInFlight) {
        return processingInFlight;
    }

    processingInFlight = runProcessOutbox().finally(() => {
        processingInFlight = null;
    });

    return processingInFlight;

}

async function runProcessOutbox(): Promise<void> {

    const pending = await offlineDb.outbox
        .where("status")
        .equals("pending")
        .sortBy("createdAt");

    for (const item of pending) {

        if (!navigator.onLine) {
            break;
        }

        try {

            await api.request({
                method: item.method,
                url: item.endpoint,
                data: item.payload
            });

            await offlineDb.outbox.delete(item.id);

            const queryKey = ENTITY_QUERY_KEYS[item.entity];

            if (queryKey) {
                queryClient.invalidateQueries({ queryKey });
            }

        } catch (error) {

            if (isNetworkError(error)) {
                break;
            }

            const message =
                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo sincronizar.";

            await offlineDb.outbox.update(item.id, {
                status: "error",
                lastError: message,
                attempts: item.attempts + 1,
                updatedAt: Date.now()
            });

        }

    }

}

export async function retryOutboxItem(id: string): Promise<void> {

    await offlineDb.outbox.update(id, {
        status: "pending",
        updatedAt: Date.now()
    });

}

export async function discardOutboxItem(id: string): Promise<void> {
    await offlineDb.outbox.delete(id);
}
