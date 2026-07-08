# Entidad: Client

## Descripción

Representa una persona natural o jurídica que realiza compras en la empresa.

Cada cliente tendrá asignado un perfil de margen (MarginProfile), el cual determinará automáticamente el precio de venta aplicado a todos los productos.

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| document | VARCHAR | Sí | Documento de identificación (Cédula o RUC) |
| firstName | VARCHAR | No | Nombres |
| lastName | VARCHAR | No | Apellidos |
| companyName | VARCHAR | No | Nombre de la empresa |
| phone | VARCHAR | No | Teléfono |
| email | VARCHAR | No | Correo electrónico |
| address | VARCHAR | No | Dirección |
| marginProfileId | FK | Sí | Perfil de margen asignado |
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha de creación |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |

# Reglas del Negocio

- Todo cliente deberá tener un documento único.
- Todo cliente deberá tener asignado un MarginProfile.
- Un cliente podrá ser una persona natural o una empresa.
- Si el cliente es una persona natural, deberá registrar firstName y lastName.
- Si el cliente es una empresa, deberá registrar companyName.
- Un cliente inactivo no podrá utilizarse en nuevas ventas.
- Ningún cliente podrá eliminarse físicamente.

# Relaciones

## MarginProfile

MarginProfile (1) → Client (N)

---

## InventoryMovement

Client (1) → InventoryMovement (N)

La relación con InventoryMovement será opcional, ya que existen movimientos que no corresponden a una venta.

# Índices

- uuid (Único)
- document (Único)
- marginProfileId
- isActive

# Observaciones

El cliente no almacena precios.

El precio de venta se obtendrá automáticamente a partir del MarginProfile asignado al cliente y de los registros existentes en ProductPrice.

Esta estrategia garantiza que todos los clientes asociados al mismo perfil utilicen exactamente la misma política de precios.