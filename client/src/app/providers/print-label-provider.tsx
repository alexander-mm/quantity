import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type PropsWithChildren
} from "react";
import JsBarcode from "jsbarcode";

type PrintableProduct = {
    barcode: string;
    internalCode: string;
    name: string;
};

type PrintLabelContextValue = {
    printLabel: (product: PrintableProduct) => void;
};

const PrintLabelContext = createContext<PrintLabelContextValue | null>(null);

export function usePrintLabel(): PrintLabelContextValue {

    const context = useContext(PrintLabelContext);

    if (!context) {
        throw new Error("usePrintLabel debe usarse dentro de <PrintLabelProvider>.");
    }

    return context;

}

// Etiqueta de producto para impresora térmica (31mm x 24mm, ver
// tailwind.css). Se imprime con la misma página actual — sin ventanas
// emergentes, que suelen bloquearse en el PWA instalado en el celular — y se
// oculta todo lo demás durante la impresión mediante CSS (@media print).
export function PrintLabelProvider({
    children
}: PropsWithChildren) {

    const [product, setProduct] = useState<PrintableProduct | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {

        if (!product || !svgRef.current) {
            return;
        }

        // Se codifica sin espacios: permite que JsBarcode use el subset
        // numérico de CODE128 (dos dígitos por símbolo) cuando el código es
        // todo números, dejando barras más gruesas y fáciles de leer. El
        // margen (zona silenciosa) es obligatorio: sin él, muchos lectores no
        // detectan dónde empieza o termina el código.
        JsBarcode(svgRef.current, product.internalCode, {
            format: "CODE128",
            displayValue: false,
            margin: 0,
            width: 1,
            height: 60
        });

        const handleAfterPrint = () => setProduct(null);

        window.addEventListener("afterprint", handleAfterPrint);

        const timer = setTimeout(() => {
            window.print();
        }, 150);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("afterprint", handleAfterPrint);
        };

    }, [product]);

    return (
        <PrintLabelContext.Provider value={{ printLabel: setProduct }}>

            {children}

            {product && (
                <div
                    id="print-label-area"
                    className="hidden flex-col items-center justify-center print:flex"
                >
                    <svg ref={svgRef} className="h-auto max-w-full" />
                    <p className="text-center text-[10px] leading-tight font-semibold">
                        {product.internalCode}
                    </p>
                    <p className="line-clamp-1 text-center text-[8px] leading-tight text-muted-foreground">
                        {product.name}
                    </p>
                </div>
            )}

        </PrintLabelContext.Provider>
    );

}
