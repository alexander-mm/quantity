# Entidad: Product

## Descripción

Representa un artículo físico administrado por el sistema de inventario.

Cada producto pertenece a una categoría, una marca y una unidad de medida.

El producto almacena únicamente la información maestra del artículo.

Las existencias por tienda serán administradas por una entidad independiente llamada InventoryStock.

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| internalCode | VARCHAR | Sí | Código interno único |
| barcode | VARCHAR | No | Código de barras único |
| name | VARCHAR | Sí | Nombre del producto |
| description | TEXT | No | Descripción |
| brandId | FK | Sí | Marca del producto |
| categoryId | FK | Sí | Categoría |
| unitOfMeasureId | FK | Sí | Unidad de medida |
| costPrice | DECIMAL | Sí | Precio de costo |
| minimumStock | DECIMAL | Sí | Stock mínimo permitido |
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha de creación |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |

# Reglas del Negocio

- Todo producto deberá tener un código interno único.
- El código de barras, cuando exista, deberá ser único.
- Todo producto deberá pertenecer a una categoría.
- Todo producto deberá pertenecer a una marca.
- Todo producto deberá tener una unidad de medida.
- Todo producto deberá tener un precio de costo.
- El precio de venta no se almacenará directamente en la entidad Product. El sistema generará y mantendrá automáticamente los registros correspondientes en la entidad ProductPrice para cada MarginProfile existente.
- Solo el Administrador podrá crear, modificar o desactivar productos.
- Un producto inactivo no podrá utilizarse en nuevos movimientos.


# Relaciones
## Category
Category (1) → Product (N)

## Brand
Brand (1) → Product (N)


## UnitOfMeasure
UnitOfMeasure (1) → Product (N)


## InventoryMovement
Product (1) → InventoryMovement (N)


## InventoryStock
Product (1) → InventoryStock (N)


## ProductImage
Product (1) → ProductImage (N)

## MarginProfile
Product (1) → ProductPrice (N)


# Índices
- uuid (Único)
- internalCode (Único)
- barcode (Único)
- categoryId
- brandId
- unitOfMeasureId
- isActive


# Observaciones

El producto representa únicamente la información maestra del artículo.

No almacena existencias.

No almacena precios de venta.

No almacena imágenes.

La información relacionada con existencias, imágenes y precios calculados será administrada mediante entidades especializadas.

Los precios de venta no se almacenan en Product.

Los precios calculados se almacenan en ProductPrice.