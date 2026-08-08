// Piezas y materia prima no tienen categoría, así que su multiplicador de
// stock medio es un estándar fijo (no configurable por el usuario):
// piezas se producen en el mismo taller y materia prima se compra localmente,
// ambas con reposición predecible, a diferencia de productos importados.
export const PART_STOCK_MULTIPLIER = 1.5;
export const RAW_MATERIAL_STOCK_MULTIPLIER = 1.5;
