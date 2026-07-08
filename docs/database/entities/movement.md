# Entidad: InventoryMovement

## Descripción

Representa cualquier cambio realizado sobre el inventario.

Todo movimiento genera una trazabilidad completa y nunca podrá eliminarse.

El inventario del sistema se obtiene a partir de los movimientos registrados y del stock consolidado en InventoryStock.

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| movementTypeId | FK | Sí | Tipo de movimiento |
| productId | FK | Sí | Producto |
| storeId | FK | Sí | Tienda donde ocurre el movimiento |
| userId | FK | Sí | Usuario responsable |
| clientId | FK | No | Cliente asociado (solo en ventas) |
| quantity | DECIMAL | Sí | Cantidad del movimiento |
| unitCost | DECIMAL | Sí | Costo unitario al momento del movimiento |
| observations | TEXT | No | Observaciones |
| movementDate | DATETIME | Sí | Fecha real del movimiento |
| syncStatus | ENUM | Sí | Estado de sincronización |
| createdAt | DATETIME | Sí | Fecha de creación del registro |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |

# Reglas del Negocio

- Todo movimiento deberá estar asociado a un producto.
- Todo movimiento deberá estar asociado a una tienda.
- Todo movimiento deberá tener un usuario responsable.
- La cantidad deberá ser mayor que cero.
- El costo unitario se almacenará como histórico y nunca se actualizará.
- Ningún movimiento podrá eliminarse físicamente.
- Una vez sincronizado, el movimiento no podrá modificarse.

# Relaciones

## MovementType

MovementType (1) → InventoryMovement (N)

---

## Product

Product (1) → InventoryMovement (N)

---

## Store

Store (1) → InventoryMovement (N)

---

## User

User (1) → InventoryMovement (N)

---

## Client

Client (1) → InventoryMovement (N)

(Relación opcional)

# Índices

- uuid (Único)
- movementTypeId
- productId
- storeId
- userId
- clientId
- movementDate
- syncStatus

# Observaciones

InventoryMovement constituye la fuente oficial de auditoría del sistema.

Todo cambio de inventario deberá generar un movimiento.

El campo unitCost conservará el valor histórico del producto en el momento exacto del movimiento, garantizando la consistencia de reportes históricos.