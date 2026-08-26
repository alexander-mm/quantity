import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuoteForm } from "./quote-form";
import type { Quote } from "@/types";

type Props = {
    open: boolean;
    quote?: Quote | null;
    onOpenChange: (open: boolean) => void;
};

export function QuoteModal({ open, quote, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{quote ? `Editar cotización ${quote.number}` : "Nueva cotización"}</DialogTitle>
                </DialogHeader>
                <QuoteForm
                    key={quote?.id ?? "new"}
                    quote={quote}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
