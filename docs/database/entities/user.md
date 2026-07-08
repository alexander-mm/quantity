# Entidad: User

## Descripción

Representa una persona autorizada para acceder al sistema y realizar operaciones según los permisos asignados por su rol.

Cada usuario pertenece a una única tienda y posee un único rol.

---

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global para sincronización |
| username | VARCHAR | Sí | Nombre de usuario para iniciar sesión |
| password | VARCHAR | Sí | Contraseña cifrada |
| firstName | VARCHAR | Sí | Nombres |
| lastName | VARCHAR | Sí | Apellidos |
| email | VARCHAR | No | Correo electrónico |
| phone | VARCHAR | No | Teléfono |
| roleId | FK | Sí | Rol asignado |
| storeId | FK | Sí | Tienda a la que pertenece |
| isActive | BOOLEAN | Sí | Estado del usuario |
| createdAt | DATETIME | Sí | Fecha de creación |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario que creó el registro |
| updatedBy | FK | No | Último usuario que modificó el registro |

# Reglas del Negocio
- Todo usuario debe pertenecer a una tienda.
- Todo usuario debe tener un rol asignado.
- El nombre de usuario debe ser único.
- La contraseña siempre se almacenará cifrada.
- Un usuario inactivo no podrá iniciar sesión.
- Solo un Administrador podrá crear o modificar usuarios.
- Ningún usuario podrá eliminarse físicamente.


# Relaciones
## Role
Muchos usuarios pertenecen a un rol.

User (N) → Role (1)

---

## Store
Muchos usuarios pertenecen a una tienda.
User (N) → Store (1)

---

## InventoryMovement
Un usuario puede registrar muchos movimientos.
User (1) → InventoryMovement (N)

# Índices
- username (Único)
- uuid (Único)
- roleId
- storeId
- isActive

# Observaciones
- La contraseña nunca podrá recuperarse; únicamente podrá restablecerse.
- El sistema almacenará únicamente el hash de la contraseña.
- La autenticación se realizará mediante JWT.
- El usuario autenticado determinará los permisos disponibles en toda la aplicación.