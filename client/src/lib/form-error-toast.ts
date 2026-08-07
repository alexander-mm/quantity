import { toast } from "react-hot-toast";
import type { FieldErrors, FieldValues } from "react-hook-form";

function findFirstMessage(value: unknown): string | undefined {

    if (!value || typeof value !== "object") {
        return undefined;
    }

    const record = value as Record<string, unknown>;

    if (typeof record.message === "string" && record.message.length > 0) {
        return record.message;
    }

    for (const key of Object.keys(record)) {

        if (key === "type" || key === "ref" || key === "types") {
            continue;
        }

        const found = findFirstMessage(record[key]);

        if (found) {
            return found;
        }

    }

    return undefined;

}

// Callback para el segundo argumento de handleSubmit(onSubmit, onFormError): cuando la
// validación falla, muestra en un toast el mensaje del primer campo con error, además del
// mensaje en rojo que ya aparece bajo cada campo del formulario.
export function onFormError<T extends FieldValues>(errors: FieldErrors<T>): void {

    const message = findFirstMessage(errors) ?? "Revisa los campos marcados en el formulario.";

    toast.error(message);

}
