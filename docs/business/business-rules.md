# Reglas del Negocio

Las siguientes reglas representan el comportamiento obligatorio del sistema y deberán cumplirse en todo momento.

## Inventario

- El stock nunca podrá modificarse manualmente.
- Todo cambio de stock deberá originarse mediante un movimiento registrado.
- Todo movimiento deberá estar asociado a un usuario.
- Todo movimiento deberá estar asociado a una tienda.
- No podrá registrarse una venta sin un producto.
- No podrá registrarse una venta con stock insuficiente.
- No podrá registrarse una transferencia con stock insuficiente.
- Todo ajuste de inventario deberá registrar una observación obligatoria.
- Ningún movimiento podrá eliminarse.
- Si existe un error, deberá registrarse un movimiento correctivo que preserve el historial.

## Productos

- El código interno deberá ser único.
- El código de barras deberá ser único.
- Todo producto deberá pertenecer a una categoría.
- Todo producto deberá tener una unidad de medida.
- Solo el Administrador podrá crear, modificar o desactivar productos.
- Un producto desactivado no podrá utilizarse en nuevos movimientos.

## Usuarios

- Todo usuario deberá pertenecer a una tienda.
- Todo usuario deberá tener un rol asignado.
- Todo usuario deberá autenticarse para utilizar el sistema.
- Solo el Administrador podrá crear usuarios.
- Solo el Administrador podrá modificar roles.
- Los usuarios solo podrán consultar la información correspondiente a su tienda.

## Clientes

- Un cliente podrá realizar múltiples compras.
- Una venta podrá registrarse sin cliente únicamente si la configuración del sistema lo permite.
- Solo el Administrador podrá crear o modificar listas de beneficios asociadas a clientes.

## Precios

- Todo producto deberá tener un precio de costo.
- Los precios de venta se calcularán automáticamente utilizando el porcentaje de beneficio correspondiente.
- Solo el Administrador podrá modificar costos.
- Solo el Administrador podrá modificar porcentajes de beneficio.
- Los usuarios de tienda solo podrán consultar los precios de venta.

- El sistema deberá funcionar sin conexión a Internet.
- Todo movimiento generado sin conexión deberá sincronizarse automáticamente cuando exista conectividad.
- Ningún movimiento deberá perderse durante la sincronización.
- La sincronización nunca deberá modificar el historial de movimientos.
- El estado de sincronización deberá ser visible para el usuario.

## Auditoría

- Todo movimiento deberá conservar su historial.
- Toda operación deberá registrar fecha y hora.
- Toda operación deberá registrar el usuario responsable.
- Toda operación deberá registrar la tienda donde ocurrió.
- El sistema nunca eliminará información histórica.

## Seguridad

- Todo acceso requerirá autenticación.
- Las contraseñas deberán almacenarse cifradas.
- Los permisos se controlarán mediante roles.
- Las sesiones deberán expirar después de un período de inactividad configurable.

## Reglas Generales

- La Bodega Principal será tratada como una tienda con el tipo `MAIN_WAREHOUSE`.
- Todo cambio del inventario deberá ser trazable.
- Ningún proceso podrá modificar directamente el stock.
- Toda operación deberá respetar los permisos del usuario autenticado.
- La información deberá permanecer consistente entre la base de datos local y la base de datos central después de cada sincronización.