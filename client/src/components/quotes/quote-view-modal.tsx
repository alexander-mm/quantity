import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuoteView } from "./quote-view";
import type { Quote } from "@/types";

type Props = {
    open: boolean;
    quote: Quote | null;
    onOpenChange: (open: boolean) => void;
};

export function QuoteViewModal({ open, quote, onOpenChange }: Props) {

    if (!quote) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Cotización {quote.number}</DialogTitle>
                </DialogHeader>
                <QuoteView quote={quote} onClose={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
