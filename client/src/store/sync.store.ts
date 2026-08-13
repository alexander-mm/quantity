import { create } from "zustand";

export type SyncStatus = "idle" | "syncing" | "success" | "error";

interface SyncState {

    status: SyncStatus;

    lastSyncedAt: number | null;

    error: string | null;

    setSyncing: () => void;

    setSuccess: (lastSyncedAt: number) => void;

    setError: (error: string) => void;

}

export const useSyncStore = create<SyncState>()((set) => ({

    status: "idle",

    lastSyncedAt: null,

    error: null,

    setSyncing: () =>
        set({ status: "syncing", error: null }),

    setSuccess: (lastSyncedAt) =>
        set({ status: "success", lastSyncedAt, error: null }),

    setError: (error) =>
        set({ status: "error", error })

}));
