import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
    currentValue: number;
    onSave: (value: number) => void;
    saving?: boolean;
    editElsewhereLabel: string;
};

export function MinimumStockField({ currentValue, onSave, saving, editElsewhereLabel }: Props) {

    const [draft, setDraft] = useState("");

    if (currentValue > 0) {
        return (
            <div>
                <Label className="mb-1">Stock mínimo</Label>
                <p className="text-sm">{currentValue}</p>
                <p className="mt-1 text-xs text-muted-foreground">{editElsewhereLabel}</p>
            </div>
        );
    }

    return (
        <div>
            <Label className="mb-1">Stock mínimo (opcional)</Label>
            <div className="flex gap-2">
                <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                />
                <Button
                    type="button"
                    variant="outline"
                    disabled={saving || draft === ""}
                    onClick={() => {
                        onSave(Number(draft));
                        setDraft("");
                    }}
                >
                    Guardar
                </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
                Todavía no tiene stock mínimo configurado. Puedes definirlo aquí de una vez.
            </p>
        </div>
    );

}
