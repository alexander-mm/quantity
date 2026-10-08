// Token secreto que identifica a este equipo como reloj checador autorizado. Lo entrega el
// servidor cuando un administrador autoriza el equipo y nunca se muestra en pantalla.
const STORAGE_KEY = "quantity.attendanceDeviceToken";

export function getAttendanceDeviceToken(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setAttendanceDeviceToken(token: string): void {
    try {
        localStorage.setItem(STORAGE_KEY, token);
    } catch {
        // Sin acceso a localStorage el equipo no puede quedar autorizado; el reloj
        // seguirá mostrando "no autorizado" y el admin lo verá al reintentar.
    }
}
