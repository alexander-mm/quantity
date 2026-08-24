import { useEffect, useRef, useState } from "react";
import { ScanBarcode } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

type Props = {
    onScan: (value: string) => void;
    title?: string;
};

// Escaneo con cámara (celular/PWA). En escritorio, el lector de código de
// barras USB ya funciona en estos mismos campos porque escribe como si fuera
// un teclado — no necesita este botón, ver lib/product-barcode.ts.
export function BarcodeScanButton({
    onScan,
    title = "Escanear código de barras"
}: Props) {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);

    useEffect(() => {

        if (!open) {
            return;
        }

        setError(null);

        const reader = new BrowserMultiFormatReader();
        let cancelled = false;

        reader.decodeFromVideoDevice(
            undefined,
            videoRef.current ?? undefined,
            (result, _err, controls) => {

                controlsRef.current = controls;

                if (cancelled || !result) {
                    return;
                }

                controls.stop();
                setOpen(false);
                onScan(result.getText());

            }
        ).catch(() => {

            if (!cancelled) {
                setError("No se pudo acceder a la cámara. Verifica los permisos del navegador.");
            }

        });

        return () => {
            cancelled = true;
            controlsRef.current?.stop();
            controlsRef.current = null;
        };

    }, [open, onScan]);

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size="icon"
                title={title}
                onClick={() => setOpen(true)}
            >
                <ScanBarcode size={16} />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Escanear código de barras</DialogTitle>
                        <DialogDescription>
                            Apunta la cámara al código de barras del producto.
                        </DialogDescription>
                    </DialogHeader>

                    {error ? (
                        <p className="text-sm text-red-500">{error}</p>
                    ) : (
                        <video
                            ref={videoRef}
                            className="w-full rounded-lg bg-black"
                            muted
                            playsInline
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );

}
