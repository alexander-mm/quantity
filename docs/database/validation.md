# Validación del Modelo de Datos

## Objetivo

Verificar que el modelo de datos diseñado representa correctamente el funcionamiento del negocio antes de iniciar la implementación.

# Checklist

## Entidades

- [x] Todas las entidades representan un elemento real del negocio.
- [x] Cada entidad tiene una única responsabilidad.
- [x] No existen entidades duplicadas.

---

## Atributos

- [x] Todos los atributos tienen un propósito definido.
- [x] No existen datos duplicados.
- [x] Se utilizan nombres descriptivos en inglés.
- [x] Todas las entidades principales incluyen auditoría.

---

## Relaciones

- [x] Todas las claves foráneas representan relaciones reales.
- [x] No existen relaciones innecesarias.
- [x] El modelo permite crecer sin romper compatibilidad.

---

## Inventario

- [x] El stock no pertenece al producto.
- [x] Todo cambio del inventario genera un movimiento.
- [x] El historial de movimientos nunca se elimina.

---

## Sincronización

- [x] Todas las entidades utilizan UUID.
- [x] El modelo está preparado para funcionamiento offline.

---

## Seguridad

- [x] Todas las entidades principales utilizan Soft Delete.
- [x] Toda la información es auditable.

# Decisiones Confirmadas

## Inventario

- El stock será administrado por la entidad InventoryStock.
- Product no almacenará existencias.

---

## Precios

- Los perfiles de margen serán administrados mediante MarginProfile.
- Los precios calculados se almacenarán en ProductPrice.
- Los clientes tendrán asignado un MarginProfile.
- El sistema permitirá crear una cantidad ilimitada de perfiles de margen.

---

## Productos

- Las marcas serán administradas mediante Brand.
- Las unidades de medida serán administradas mediante UnitOfMeasure.
- Las imágenes serán administradas mediante ProductImage.

---

## Categorías

- Se soportarán categorías jerárquicas mediante parentCategoryId.

---

## Auditoría

- Todas las entidades principales tendrán UUID.
- Todas las entidades principales utilizarán Soft Delete.
- Todas las entidades principales incluirán campos de auditoría.

# Entidades Diseñadas

- User
- Role
- Store
- Category
- Product
- Brand
- UnitOfMeasure
- ProductImage
- MarginProfile
- ProductPrice
- Client
- InventoryMovement
- MovementType
- InventoryStock
- Settings

# Estado

La Fase 2 ha finalizado correctamente.

El modelo de datos se considera validado y preparado para continuar con la siguiente fase del diseño de la base de datos.