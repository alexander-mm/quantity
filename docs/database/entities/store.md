# Entidad: Store

## Descripción

Representa una sede física de la empresa.

Una Store puede ser una Bodega Principal o una Tienda.

El comportamiento de cada una dependerá del tipo asignado.

Todas las operaciones del sistema estarán asociadas a una Store.

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| code | VARCHAR | Sí | Código único de la tienda |
| name | VARCHAR | Sí | Nombre de la tienda |
| type | ENUM | Sí | Tipo de tienda |
| address | VARCHAR | No | Dirección |
| city | VARCHAR | No | Ciudad |
| phone | VARCHAR | No | Teléfono |
| email | VARCHAR | No | Correo electrónico |
| manager | VARCHAR | No | Responsable de la tienda |
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha de creación |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |



# Tipos de Store

Actualmente existirán dos tipos:

- MAIN_WAREHOUSE
- STORE

## Descripción

MAIN_WAREHOUSE

Representa la Bodega Principal.

Puede:

- Registrar compras.
- Transferir inventario.
- Vender.
- Entregar productos al personal.
- Consultar toda la información.

STORE

Representa una tienda.

Puede:

- Registrar ventas.
- Entregar productos al personal.
- Consultar únicamente su información.

# Reglas del Negocio

- Toda tienda deberá tener un código único.
- Toda tienda deberá tener un nombre.
- Toda tienda podrá tener múltiples usuarios.
- Toda tienda podrá almacenar cualquier producto.
- Solo existirá una Store de tipo MAIN_WAREHOUSE.
- Una tienda inactiva no podrá registrar movimientos.
- Ninguna tienda podrá eliminarse físicamente.

# Relaciones

## User

Una tienda puede tener muchos usuarios.

Store (1) → User (N)

---

## InventoryMovement

Una tienda puede registrar muchos movimientos.

Store (1) → InventoryMovement (N)

---

## InventoryStock

Una tienda puede tener existencias de muchos productos.

Store (1) → InventoryStock (N)

# Índices

- uuid (Único)
- code (Único)
- name
- type
- isActive

# Observaciones

La Bodega Principal no tendrá una estructura diferente a las demás tiendas.

La diferencia estará determinada únicamente por el valor del campo `type` y por los permisos del usuario autenticado.

Esta decisión simplifica el desarrollo, la sincronización y la escalabilidad del sistema.