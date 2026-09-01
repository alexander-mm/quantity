import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageContainer, PageHeader, WeeklyReportsTable, WeeklyReportViewerModal } from "@/components";
import { LoadingState } from "@/components/ui/spinner";
import { useWeeklyReports } from "@/hooks";
import { getWeeklyReportPdfBlob } from "@/services";
import type { WeeklyReport } from "@/types";

export function WeeklyReportsPage() {

    const { data, isLoading, isError } = useWeeklyReports();

    const reports = data?.data ?? [];

    const [viewingReport, setViewingReport] = useState<WeeklyReport | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const handleView = async (report: WeeklyReport) => {

        try {

            const blob = await getWeeklyReportPdfBlob(report.id);
            setPdfUrl(URL.createObjectURL(blob));
            setViewingReport(report);

        } catch {
            toast.error("No se pudo abrir el informe.");
        }

    };

    const handleClose = () => {

        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }

        setPdfUrl(null);
        setViewingReport(null);

    };

    return (
        <PageContainer>

            <PageHeader
                title="Informes semanales"
                description="Informes de ventas y dinero generados automáticamente cada semana, enviados a Telegram y disponibles aquí para verlos o imprimirlos."
            />

            <div className="mt-8">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los informes semanales.</p>}
                {!isLoading && !isError && (
                    reports.length === 0
                        ? <p className="text-muted-foreground">Todavía no se ha generado ningún informe semanal.</p>
                        : <WeeklyReportsTable reports={reports} onView={handleView} />
                )}
            </div>

            <WeeklyReportViewerModal
                report={viewingReport}
                pdfUrl={pdfUrl}
                onOpenChange={(open) => { if (!open) handleClose(); }}
            />

        </PageContainer>
    );

}
