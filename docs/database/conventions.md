
## Objetivo

Este documento define las reglas generales que deberán seguir todas las entidades de la base de datos del sistema.

Estas convenciones garantizan consistencia, mantenibilidad y escalabilidad.

---

# Regla 1 - Auditoría

Todas las entidades principales deberán incluir los siguientes campos:

- id
- uuid
- createdAt
- updatedAt
- createdBy
- updatedBy
- isActive

Estos campos serán obligatorios para garantizar trazabilidad y auditoría.

---

# Regla 2 - Nomenclatura

No se utilizarán nombres abreviados.

Ejemplo:

❌ prod_nom

✅ productName

Todos los nombres deberán ser descriptivos.

---

# Regla 3 - No duplicar información

La información deberá existir en un único lugar.

Ejemplo:

La entidad Product no almacenará el nombre de la categoría.

Únicamente almacenará:

categoryId

El nombre de la categoría será obtenido mediante la relación correspondiente.

---

# Regla 4 - Idioma

Toda la base de datos utilizará nombres en inglés.

Ejemplos:

- product
- category
- user
- store
- inventoryMovement

La interfaz del usuario utilizará español.

---

# Regla 5 - Claves Primarias

Todas las entidades utilizarán:

- id (BIGINT autoincremental)
- uuid (UUID global)

El id optimizará las relaciones internas.

El uuid permitirá sincronización entre equipos.

---

# Regla 6 - Soft Delete

Las entidades principales no se eliminarán físicamente.

Se utilizará el campo:

isActive

para controlar su disponibilidad.

El historial permanecerá intacto.

---

# Regla 7 - Fechas

Todas las fechas se almacenarán en UTC.

La conversión a la zona horaria del usuario se realizará únicamente en la interfaz.

---

# Regla 8 - Integridad

Toda clave foránea deberá apuntar a un registro existente.

No existirán referencias huérfanas.

---

# Regla 9 - Consistencia

Los nombres de tablas, columnas, índices y restricciones utilizarán una nomenclatura uniforme durante todo el proyecto.

No se mezclarán diferentes estilos de nombres.

---

# Regla 10 - Escalabilidad

Las entidades deberán diseñarse considerando futuras ampliaciones del sistema sin requerir modificaciones incompatibles con la estructura existente.

# Decisiones de Arquitectura

Durante el diseño del modelo se adoptan las siguientes decisiones:

- La Bodega Principal será una Store de tipo `MAIN_WAREHOUSE`.
- El inventario se controlará mediante movimientos.
- El stock actual se optimizará mediante una estructura dedicada de existencias por tienda y producto.
- Las imágenes de productos se almacenarán en una entidad independiente (`ProductImage`).
- Las marcas se administrarán mediante una entidad (`Brand`).
- Las unidades de medida se administrarán mediante una entidad (`UnitOfMeasure`).
- El sistema estará preparado para sincronización offline utilizando UUID como identificador global.