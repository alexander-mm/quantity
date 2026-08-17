// Para campos de "solo fecha" (saleDate, dispatchDate, purchaseDate, etc.) el dia
// calendario importa, no el instante. Usar new Date(iso).toLocaleDateString() los
// reinterpreta en la zona horaria local: un valor guardado como medianoche UTC se ve
// un dia antes en cualquier zona horaria negativa (ej. Ecuador, UTC-5). Estas
// funciones trabajan directamente sobre el texto "YYYY-MM-DD" para no arrastrar ese
// desfase.

export function todayLocalDateString(): string {

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

export function formatDateOnly(value: string): string {

    const [year, month, day] = value.slice(0, 10).split("-");

    if (!year || !month || !day) {
        return value;
    }

    return `${day}/${month}/${year}`;

}
