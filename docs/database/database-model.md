# Modelo de Base de Datos

## Tablas Principales
- roles
- stores
- users
- categories
- products
- customers
- profit_margins
- inventory_movements
- movement_types
- notifications
- settings
- sync_queue

# roles
Define los permisos disponibles dentro del sistema.

---

## stores
Representa todas las sedes de la empresa.

Incluye la Bodega Principal y las Tiendas.

La Bodega Principal será una tienda cuyo tipo será `MAIN_WAREHOUSE`.

---

## users
Usuarios autorizados para ingresar al sistema.

Cada usuario pertenece a una tienda y posee un rol.

---

## categories
Clasificación de productos.

---

## products
Productos administrados por el inventario.

---

## customers
Clientes registrados.

---
## profit_margins
## margin_profiles
## product_prices
Porcentajes utilizados para calcular automáticamente los precios de venta.

---

## inventory_movements
Registra absolutamente todos los movimientos del inventario.

Es la tabla más importante del sistema.

---

## movement_types
Catálogo de tipos de movimiento.

Ejemplos:
- Compra
- Venta
- Transferencia
- Ajuste
- Entrega al personal
- Devolución

---

## notifications
Alertas generadas por el sistema.

---

## settings
Configuraciones generales del sistema.

---

## sync_queue
Registra los cambios pendientes de sincronización entre la base local y el servidor central.


# Clasificación

## Catálogos
- roles
- categories
- movement_types
- profit_margins

## Operativas
- users
- stores
- products
- customers
- inventory_movements

## Configuración
- settings

## Sistema
- notifications
- sync_queue

 Decisiones de Arquitectura

- Todas las tablas utilizarán UUID como clave primaria.
- Ninguna tabla eliminará registros críticos físicamente.
- Todas las tablas principales tendrán auditoría.
- La tabla `inventory_movements` será la fuente oficial del inventario.
- El stock será un dato derivado de los movimientos y optimizado mediante almacenamiento del stock actual por tienda y producto.
- La sincronización trabajará mediante una cola de cambios (`sync_queue`).