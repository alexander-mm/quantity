 Modelo de Negocio

## Objetivo

El sistema permitirá controlar el inventario de una empresa que posee una Bodega Principal y varias Tiendas.

La Bodega Principal administra todo el inventario de la empresa.

Las Tiendas administran únicamente su propio inventario.

El sistema funcionará offline y sincronizará automáticamente cuando exista conexión a Internet.

Todo cambio en el inventario se realizará mediante movimientos registrados.

El stock nunca será modificado directamente.

Toda la información será auditable, garantizando la trazabilidad completa de cada operación realizada en el sistema.

## Actores

### Administrador

Representa la Bodega Principal.

**Puede:**

- Administrar usuarios.
- Administrar productos.
- Administrar categorías.
- Administrar clientes.
- Administrar perfiles de margen
- Registrar compras.
- Registrar ventas.
- Registrar entregas al personal.
- Transferir inventario entre tiendas.
- Consultar información de todas las tiendas.
- Visualizar costos.
- Configurar parámetros generales del sistema.
- Generar reportes globales.

### Usuario Tienda

Representa una tienda o sucursal.

**Puede:**

- Consultar su inventario.
- Registrar ventas.
- Registrar entregas al personal.
- Consultar clientes.
- Consultar el historial de movimientos de su tienda.
- Generar reportes de su tienda.

## Entidades

- [x] Todas las entidades representan elementos reales del negocio.
- [x] No existen entidades duplicadas.
- [x] Cada entidad tiene una responsabilidad clara.

## Procesos

- [x] Todos los procesos representan operaciones reales del negocio.
- [x] Todos los procesos críticos del inventario fueron identificados.
- [x] Existen procesos para sincronización offline.

## Reglas

- [x] El stock nunca se modifica manualmente.
- [x] Todo cambio genera un movimiento.
- [x] Todo movimiento es auditable.
- [x] No se elimina información histórica.
- [x] La sincronización conserva la integridad de los datos.

## Arquitectura

- [x] La Bodega Principal será una Tienda de tipo `MAIN_WAREHOUSE`.
- [x] El inventario se calcula mediante movimientos.
- [x] El sistema funcionará offline.
- [x] Existirá sincronización automática.

# Escenarios Validados

El modelo actual permite cubrir los siguientes escenarios:

- Compra de productos para la Bodega Principal.
- Transferencia de productos desde la Bodega Principal hacia una tienda.
- Venta de productos desde una tienda.
- Venta de productos desde la Bodega Principal.
- Entrega de productos al personal.
- Ajustes positivos y negativos de inventario.
- Consulta de inventario por tienda.
- Consulta de historial de movimientos.
- Consulta de clientes.
- Gestión de precios de venta.
- Trabajo sin conexión a Internet.
- Sincronización automática al recuperar conexión.
- Alertas por stock mínimo.

# Riesgos Identificados

Durante el desarrollo deberán controlarse especialmente los siguientes aspectos:

- Evitar inconsistencias durante la sincronización offline.
- Garantizar la integridad de los movimientos de inventario.
- Evitar conflictos de concurrencia entre sedes.
- Mantener un historial completo para auditoría.
- Optimizar el rendimiento con grandes volúmenes de movimientos.

# Decisiones Confirmadas

- El MVP será una aplicación PWA.
- Electron se implementará después del MVP si es necesario.
- La aplicación utilizará IndexedDB como base de datos local.
- PostgreSQL será la base de datos central.
- Prisma será el ORM.
- React + Vite + TypeScript serán la base del frontend.
- Node.js + Express + TypeScript serán la base del backend.
- Toda modificación del inventario se realizará mediante movimientos registrados.
- Ningún movimiento podrá eliminarse.