# Entidad: Role

## Descripción
Representa un conjunto de permisos asignados a los usuarios del sistema.

Cada usuario pertenece a un único rol.

Un rol puede estar asignado a múltiples usuarios.


# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| name | VARCHAR | Sí | Nombre del rol |
| description | VARCHAR | No | Descripción |
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha creación |
| updatedAt | DATETIME | Sí | Fecha actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |


# Reglas del Negocio

- Todo usuario deberá tener un rol asignado.
- El nombre del rol deberá ser único.
- Solo el Administrador podrá crear, modificar o desactivar roles.
- Un rol no podrá eliminarse físicamente.
- Un rol inactivo no podrá asignarse a nuevos usuarios.


# Índices

- uuid (Único)
- name (Único)
- isActive

# Observaciones

Actualmente el sistema utilizará los siguientes roles:

- ADMIN
- STORE_USER

La arquitectura quedará preparada para incorporar en el futuro un sistema de permisos basado en las entidades:

- Permission
- RolePermission

De esta manera será posible asignar permisos específicos a cada rol sin modificar la estructura existente.