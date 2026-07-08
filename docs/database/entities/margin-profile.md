# Entidad: MarginProfile

## Descripción

Representa un perfil de margen definido por el Administrador.

Cada perfil establece el porcentaje utilizado para calcular automáticamente los precios de venta de todos los productos.

El sistema permitirá crear una cantidad ilimitada de perfiles.

Ejemplos:

- Precio 1
- Precio 2
- Precio 3
- Mayorista
- Distribuidor

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| name | VARCHAR | Sí | Nombre del perfil |
| marginPercentage | DECIMAL(5,2) | Sí | Porcentaje de margen |
| description | VARCHAR | No | Descripción |
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha creación |
| updatedAt | DATETIME | Sí | Fecha actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último editor |

# Reglas del Negocio

- Solo el Administrador podrá crear, editar o desactivar perfiles.
- El nombre será único.
- El porcentaje podrá modificarse en cualquier momento.
- El sistema recalculará automáticamente los precios afectados.
- No existe límite de perfiles.

# Relaciones

MarginProfile (1)

↓

Client (N)

↓

ProductPrice (N)