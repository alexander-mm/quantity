# Entidad: MovementType

## Descripción

Representa la clasificación de los movimientos de inventario.

Cada movimiento pertenece obligatoriamente a un único tipo de movimiento.

Los registros iniciales serán creados automáticamente mediante el proceso de Seed de la base de datos.

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| code | VARCHAR | Sí | Código único |
| name | VARCHAR | Sí | Nombre del tipo de movimiento |
| description | VARCHAR | No | Descripción |
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha de creación |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |

# Valores Iniciales

Los siguientes registros serán creados automáticamente mediante el Seed:

| Código | Nombre |
|---------|---------|
| PURCHASE | Compra |
| SALE | Venta |
| TRANSFER_OUT | Transferencia Salida |
| TRANSFER_IN | Transferencia Entrada |
| STAFF_DELIVERY | Entrega al Personal |
| ADJUSTMENT_IN | Ajuste Positivo |
| ADJUSTMENT_OUT | Ajuste Negativo |

# Reglas del Negocio

- El código deberá ser único.
- El nombre deberá ser único.
- Solo el Administrador podrá administrar los tipos de movimiento.
- Los registros iniciales serán creados automáticamente por el sistema.
- No se eliminarán físicamente.

# Relaciones

## InventoryMovement

MovementType (1) → InventoryMovement (N)

# Índices

- uuid (Único)
- code (Único)
- name (Único)
- isActive

# Observaciones

MovementType es un catálogo del sistema.

Su objetivo es estandarizar los tipos de movimientos utilizados en el inventario y facilitar reportes, auditorías y validaciones.