import { useRef } from "react";
import { Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDateOnly } from "@/lib/format-date";
import type { WeeklyReport } from "@/types";

type Props = {
    report: WeeklyReport | null;
    pdfUrl: string | null;
    onOpenChange: (open: boolean) => void;
};

export function WeeklyReportViewerModal({ report, pdfUrl, onOpenChange }: Props) {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    if (!report || !pdfUrl) {
        return null;
    }

    const handlePrint = () => {
        iframeRef.current?.contentWindow?.print();
    };

    return (
        <Dialog open={!!report} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Informe semanal</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {formatDateOnly(report.weekStart)} - {formatDateOnly(report.weekEnd)}
                    </p>
                </DialogHeader>

                <iframe
                    ref={iframeRef}
                    src={pdfUrl}
                    title="Informe semanal"
                    className="h-[75vh] w-full rounded-md border"
                />

                <div className="flex justify-end">
                    <Button type="button" onClick={handlePrint}>
                        <Printer size={18} />
                        Imprimir
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );

}
