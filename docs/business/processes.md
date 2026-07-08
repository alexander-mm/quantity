# Procesos del Negocio

## Procesos Identificados

- Iniciar sesión
- Cerrar sesión

- Crear usuario
- Editar usuario
- Desactivar usuario
- Cambiar contraseña

- Crear categoría
- Editar categoría
- Desactivar categoría

- Crear producto
- Editar producto
- Desactivar producto

- Registrar compra
- Registrar venta
- Registrar entrega al personal
- Registrar transferencia
- Registrar ajuste de inventario

- Consultar inventario
- Consultar movimientos
- Consultar clientes
- Consultar productos

- Crear cliente
- Editar cliente
- Desactivar cliente

Administrar perfiles de margen

- Generar reportes

- Sincronizar información

- Gestionar notificaciones

# Procesos por Módulo

## Autenticación

- Iniciar sesión
- Cerrar sesión

---

## Usuarios

- Crear
- Editar
- Desactivar
- Cambiar contraseña

---

## Categorías

- Crear
- Editar
- Desactivar
- Consultar

---

## Productos

- Crear
- Editar
- Desactivar
- Consultar
- Buscar
- Escanear código de barras

---

## Clientes

- Crear
- Editar
- Desactivar
- Consultar
- Buscar

---

## Inventario

- Registrar compra
- Registrar venta
- Registrar entrega al personal
- Registrar transferencia
- Registrar ajuste
- Consultar stock
- Consultar movimientos

---

## Beneficios

- Crear porcentaje
- Editar porcentaje
- Desactivar porcentaje
- Consultar porcentajes

---

## Reportes

- Diario
- Semanal
- Mensual
- Por fechas
- Por cliente
- Por usuario
- Por tienda

---

## Sincronización

- Enviar movimientos
- Recibir actualizaciones
- Resolver sincronización
- Consultar estado

---

## Notificaciones

- Stock mínimo
- Sincronización
- Nueva versión disponible
- Errores del sistema

# Procesos Críticos

Los siguientes procesos son considerados críticos porque afectan directamente el inventario de la empresa:

- Registrar compra
- Registrar venta
- Registrar transferencia
- Registrar entrega al personal
- Registrar ajuste de inventario

Todos estos procesos deberán:

- Registrar el usuario responsable.
- Registrar la tienda donde ocurrió el movimiento.
- Registrar la fecha y hora.
- Registrar el estado de sincronización.
- Generar un movimiento de inventario.
- Actualizar automáticamente el stock.
- Mantener trazabilidad completa.

# Dependencias entre Procesos

Para ejecutar algunos procesos es necesario que otros existan previamente.

Ejemplos:

- No se puede registrar una venta si no existen productos.
- No se puede registrar una venta sin un usuario autenticado.
- No se puede registrar una compra sin un producto.
- No se puede realizar una transferencia sin una tienda de origen y una tienda de destino.
- No se puede calcular un precio de venta si no existe un porcentaje de beneficio.
- No se puede sincronizar información sin un usuario autenticado.