# Entidad: ProductPrice

## Descripción

Almacena el precio calculado de cada producto para cada perfil de margen.

Esta entidad evita recalcular precios continuamente y mejora el rendimiento del sistema.

# Atributos

| Campo | Tipo |
|--------|------|
| id | BIGINT |
| uuid | UUID |
| productId | FK |
| marginProfileId | FK |
| price | DECIMAL |
| createdAt | DATETIME |
| updatedAt | DATETIME |

# Reglas del Negocio

- Un producto tendrá un precio por cada perfil.
- No podrán existir dos precios para el mismo producto y el mismo perfil.
- Los precios se recalcularán automáticamente cuando cambie el costo del producto.
- Los precios se recalcularán automáticamente cuando cambie el porcentaje del perfil.


# Relaciones
Product

↓

ProductPrice

↑

MarginProfile
