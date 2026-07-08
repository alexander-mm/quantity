# Entidad: Category

## Descripción

Representa una clasificación utilizada para organizar los productos del inventario.

Cada producto deberá pertenecer a una única categoría.

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| name | VARCHAR | Sí | Nombre de la categoría |
| description | VARCHAR | No | Descripción |
|parentCategoryId | FK | No | Categoría padre|
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha de creación |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |

# Reglas del Negocio

- Toda categoría deberá tener un nombre único.
- Todo producto deberá pertenecer a una categoría.
- Solo el Administrador podrá crear, modificar o desactivar categorías.
- Una categoría inactiva no podrá asignarse a nuevos productos.
- Ninguna categoría podrá eliminarse físicamente.
- Una categoría podrá pertenecer opcionalmente a otra categoría.
- Una categoría no podrá ser su propia categoría padre.
- No se permitirán referencias circulares entre categorías.


# Relaciones

## Product

Una categoría puede contener muchos productos.

Category (1) → Product (N)

## Category

Una categoría puede contener muchas subcategorías.

Category (1) → Category (N)

# Índices

- uuid (Único)
- name (Único)
- isActive

# Índices

- uuid (Único)
- name (Único)
- isActive