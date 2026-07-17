import { createJSONStorage, persist } from "zustand/middleware";
export const authPersist = persist;
export const authStorage = createJSONStorage(() => localStorage);