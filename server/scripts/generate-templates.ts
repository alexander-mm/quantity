import XLSX from "xlsx";

const headers = [
    "Código Interno",
    "Nombre",
    "Código de Barras",
    "Descripción",
    "Marca",
    "Categoría",
    "Unidad de Medida",
    "Costo",
    "Stock Mínimo",
    "Stock Inicial",
    "USD 1",
    "USD 2",
    "USD 3",
    "USD 4",
    "COP 1"
];

const exampleRow = {
    "Código Interno": "PROD-001",
    "Nombre": "Ejemplo de producto",
    "Código de Barras": "",
    "Descripción": "",
    "Marca": "Marca Ejemplo",
    "Categoría": "Categoría Ejemplo",
    "Unidad de Medida": "Unidad",
    "Costo": 10,
    "Stock Mínimo": 5,
    "Stock Inicial": 0,
    "USD 1": 20,
    "USD 2": 18,
    "USD 3": 16,
    "USD 4": 15,
    "COP 1": 80000
};

const templates = [
    { store: "MAIN", file: "scripts/templates/productos-bodega-principal.xlsx" },
    { store: "STORE 1", file: "scripts/templates/productos-tienda-1-julio-andrade.xlsx" },
    { store: "STORE 2", file: "scripts/templates/productos-tienda-2-san-gabriel.xlsx" }
];

for (const template of templates) {

    const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, template.file);

    console.log(`✅ Generado: ${template.file} (tienda: ${template.store})`);

}
