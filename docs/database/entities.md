# Entidades del Dominio

## Entidades Identificadas

- Usuario
- Rol
- Tienda
- Producto
- Categoría
- Cliente
- Movimiento
- TipoMovimiento
MarginProfile
ProductPrice
- Configuración
- Sincronización
- Notificación

## Usuario

Representa una persona autorizada para acceder al sistema y realizar operaciones según los permisos asignados.

---

## Rol

Define los permisos y capacidades que tendrá un usuario dentro del sistema.

---

## Tienda

Representa una sede física de la empresa.

La Bodega Principal también será tratada como una tienda, diferenciándose mediante su tipo (`MAIN_WAREHOUSE`).

Esta decisión simplifica la arquitectura y facilita la escalabilidad del sistema.

---

## Producto

Representa un artículo físico administrado por el inventario.

---

## Categoría

Agrupa productos con características similares para facilitar su organización y búsqueda.

---

## Cliente

Representa una persona o empresa que adquiere productos.

---

## Movimiento

Representa cualquier operación que modifica el inventario.

Todo cambio en el inventario debe estar respaldado por un movimiento.

---

## TipoMovimiento

Clasifica el tipo de movimiento realizado.

Ejemplos:

- Compra
- Venta
- Transferencia
- Entrega al personal
- Ajuste
- Devolución

---

## Beneficio MarginProfile ProductPrice

Representa un porcentaje utilizado para calcular automáticamente los precios de venta de los productos.

Ejemplos:

- Público
- Mayorista 1
- Mayorista 2
- Mayorista 3

---

## Configuración

Almacena los parámetros generales del sistema.

Ejemplos:

- Datos de la empresa
- Parámetros de sincronización
- Configuración general
- Preferencias del sistema

---

## Sincronización

Controla el estado de sincronización de los registros entre la base de datos local y el servidor central.

---

## Notificación

Representa alertas generadas por el sistema.

Ejemplos:

- Stock mínimo
- Nueva versión disponible
- Error de sincronización
- Sincronización completada

## Decisiones de Arquitectura

### Bodega Principal

La Bodega Principal no será una entidad independiente.

Será una Tienda cuyo tipo será `MAIN_WAREHOUSE`.

Esta decisión evita duplicar lógica de negocio y simplifica las consultas, permisos y procesos de sincronización.

### Inventario

El inventario no será una entidad.

El stock de cada producto será el resultado de la suma de todos los movimientos registrados para ese producto en una tienda determinada.

Esta decisión garantiza la trazabilidad completa del sistema.