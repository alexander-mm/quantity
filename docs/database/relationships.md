# Relaciones del Modelo de Datos

## Objetivo

Definir cómo se relacionan todas las entidades del sistema.

Este documento será la referencia oficial para la implementación de las relaciones en Prisma y en la base de datos.

# ¿Qué es una relación?

Una relación representa la forma en que dos entidades del negocio se conectan entre sí.

Cada relación responde a una pregunta del negocio.

Ejemplo:

¿Un usuario pertenece a una tienda?

Sí.

Entonces existe una relación entre User y Store.

Store (1) → User (N)

Otro ejemplo:

¿Un producto pertenece a varias categorías?

No.

Pertenece únicamente a una.

Category (1) → Product (N)

# Reglas

Durante el diseño seguiremos las siguientes reglas:

- Todas las relaciones deberán representar una necesidad real del negocio.
- No se crearán relaciones innecesarias.
- Se evitará duplicar información.
- Las relaciones deberán facilitar el crecimiento futuro del sistema.
- Las cardinalidades deberán quedar claramente documentadas antes de implementar la base de datos.

# Convenciones

Utilizaremos la siguiente notación:

(1) → (N)

Uno a muchos.

(N) → (N)

Muchos a muchos.

(1) → (1)

Uno a uno.

# Relaciones de User
## User → Role

### Pregunta

¿Un usuario tiene un rol?

Sí.

¿Puede tener varios roles?

No.

### Relación

Role (1) → User (N)

### Llave foránea

User.roleId

## User → Store

### Pregunta

¿Un usuario pertenece a una tienda?

Sí.

¿Puede pertenecer a varias tiendas?

No.

### Relación

Store (1) → User (N)

### Llave foránea

User.storeId

## User → InventoryMovement

### Pregunta

¿Un usuario puede registrar muchos movimientos?

Sí.

¿Cada movimiento pertenece a un solo usuario?

Sí.

### Relación

User (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.userId

## Resumen

La entidad User tendrá las siguientes relaciones:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| Role | 1 → N | roleId |
| Store | 1 → N | storeId |
| InventoryMovement | 1 → N | userId |

# Relaciones de Store
## Store → User

### Pregunta

¿Una tienda puede tener varios usuarios?

Sí.

### Relación

Store (1) → User (N)

### Llave foránea

User.storeId

## Store → InventoryMovement

### Pregunta

¿Una tienda puede registrar muchos movimientos?

Sí.

### Relación

Store (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.storeId

## Store → InventoryStock

### Pregunta

¿Una tienda puede tener existencias de muchos productos?

Sí.

¿Un registro de stock pertenece a una sola tienda?

Sí.

### Relación

Store (1) → InventoryStock (N)

### Llave foránea

InventoryStock.storeId

## Resumen

La entidad Store tendrá las siguientes relaciones:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| User | 1 → N | User.storeId |
| InventoryMovement | 1 → N | InventoryMovement.storeId |
| InventoryStock | 1 → N | InventoryStock.storeId |

## Observación

Toda la información del inventario estará asociada a una Store.

El stock de un producto no pertenece al producto directamente, sino a la combinación:

Product + Store

Esta decisión permite que un mismo producto tenga existencias independientes en la Bodega Principal y en cada una de las Tiendas.

# Relaciones de Product
## Product → Category

### Pregunta

¿Un producto pertenece a una categoría?

Sí.

¿Puede pertenecer a varias?

No.

### Relación

Category (1) → Product (N)

### Llave foránea

Product.categoryId

## Product → Brand

### Pregunta

¿Un producto pertenece a una marca?

Sí.

### Relación

Brand (1) → Product (N)

### Llave foránea

Product.brandId

## Product → UnitOfMeasure

### Pregunta

¿Un producto tiene una unidad de medida?

Sí.

### Relación

UnitOfMeasure (1) → Product (N)

### Llave foránea

Product.unitOfMeasureId

## Product → InventoryMovement

### Pregunta

¿Un producto puede aparecer en muchos movimientos?

Sí.

### Relación

Product (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.productId

## Product → InventoryStock

### Pregunta

¿Un producto puede tener existencias en varias tiendas?

Sí.

### Relación

Product (1) → InventoryStock (N)

### Llave foránea

InventoryStock.productId

## Product → ProductPrice

### Pregunta

¿Un producto tendrá varios precios calculados?

Sí.

Uno por cada MarginProfile existente.

### Relación

Product (1) → ProductPrice (N)

### Llave foránea

ProductPrice.productId

## Product → ProductImage

### Pregunta

¿Un producto podrá tener varias imágenes?

Sí.

### Relación

Product (1) → ProductImage (N)

### Llave foránea

ProductImage.productId

## Resumen

La entidad Product tendrá las siguientes relaciones:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| Category | 1 → N | Product.categoryId |
| Brand | 1 → N | Product.brandId |
| UnitOfMeasure | 1 → N | Product.unitOfMeasureId |
| InventoryMovement | 1 → N | InventoryMovement.productId |
| InventoryStock | 1 → N | InventoryStock.productId |
| ProductPrice | 1 → N | ProductPrice.productId |
| ProductImage | 1 → N | ProductImage.productId |


La entidad Product representa únicamente la información maestra del artículo.

No almacena:

- Existencias.
- Precios de venta.
- Imágenes.

Cada uno de estos elementos será administrado por entidades especializadas:

- InventoryStock
- ProductPrice
- ProductImage

Esta separación de responsabilidades mejora la escalabilidad, facilita el mantenimiento y evita la duplicación de información.

# Relaciones de Category
## Category → Product

### Pregunta

¿Una categoría puede contener muchos productos?

Sí.

¿Un producto puede pertenecer a varias categorías?

No.

### Relación

Category (1) → Product (N)

### Llave foránea

Product.categoryId
## Category → Category

### Pregunta

¿Una categoría puede tener subcategorías?

Sí.

¿Una subcategoría pertenece a una sola categoría padre?

Sí.

### Relación

Category (1) → Category (N)

### Llave foránea

Category.parentCategoryId

## Resumen

La entidad Category tendrá las siguientes relaciones:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| Product | 1 → N | Product.categoryId |
| Category | 1 → N | Category.parentCategoryId |

## Observación

Las categorías podrán organizarse en múltiples niveles mediante la relación recursiva `parentCategoryId`.

Esto permitirá construir estructuras jerárquicas sin modificar el modelo de datos.

Ejemplo:

Repuestos
├── Bombas de Vacío
├── Pulsadores
├── Pezoneras
└── Accesorios

El uso de subcategorías será opcional.

# Relaciones de Client
## Client → MarginProfile

### Pregunta

¿Un cliente tiene un perfil de margen?

Sí.

¿Puede tener varios?

No.

### Relación

MarginProfile (1) → Client (N)

### Llave foránea

Client.marginProfileId
## Client → InventoryMovement

### Pregunta

¿Un cliente puede realizar muchas compras?

Sí.

¿Todo movimiento pertenece a un cliente?

No.

Solo los movimientos de tipo Venta tendrán cliente asociado.

### Relación

Client (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.clientId

(Relación opcional)

## Resumen

La entidad Client tendrá las siguientes relaciones:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| MarginProfile | 1 → N | Client.marginProfileId |
| InventoryMovement | 1 → N | InventoryMovement.clientId (Opcional) |

## Observación

El cliente no almacena precios.

El cliente únicamente referencia un MarginProfile.

Los precios de venta serán obtenidos desde ProductPrice utilizando el MarginProfile asignado al cliente.

De esta manera, todos los clientes que pertenezcan al mismo perfil compartirán exactamente la misma política de precios.

# Relaciones de MarginProfile

## MarginProfile → Client

### Pregunta

¿Muchos clientes pueden compartir el mismo perfil de margen?

Sí.

¿Un cliente puede tener varios perfiles?

No.

### Relación

MarginProfile (1) → Client (N)

### Llave foránea

Client.marginProfileId

## MarginProfile → ProductPrice

### Pregunta

¿Un perfil de margen puede generar muchos precios?

Sí.

¿Cada precio calculado pertenece a un único perfil?

Sí.

### Relación

MarginProfile (1) → ProductPrice (N)

### Llave foránea

ProductPrice.marginProfileId

## Resumen

La entidad MarginProfile tendrá las siguientes relaciones:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| Client | 1 → N | Client.marginProfileId |
| ProductPrice | 1 → N | ProductPrice.marginProfileId |

## Observación

MarginProfile no almacena productos ni precios.

Su única responsabilidad es definir el porcentaje de margen utilizado para calcular los precios de venta.

Cuando el Administrador:

- crea un nuevo perfil,
- modifica un porcentaje de margen,

el sistema actualizará automáticamente los registros correspondientes en ProductPrice.

De esta manera, los usuarios de las tiendas siempre visualizarán precios ya calculados, sin necesidad de realizar operaciones durante la consulta o la venta.

## Ejemplo

MarginProfile

Precio 1 → 30%

Precio 2 → 20%

↓

Producto

Costo: $100

↓

ProductPrice

Precio 1 → $130

Precio 2 → $120

↓

Cliente

Juan Pérez → Precio 2

↓

Venta

El sistema utiliza automáticamente el precio de $120.

# Relaciones de MovementType
## MovementType → InventoryMovement

### Pregunta

¿Un tipo de movimiento puede utilizarse en muchos movimientos?

Sí.

¿Cada movimiento pertenece a un único tipo?

Sí.

### Relación

MovementType (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.movementTypeId

## Resumen

La entidad MovementType tendrá la siguiente relación:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| InventoryMovement | 1 → N | InventoryMovement.movementTypeId |

## Observación

MovementType es un catálogo del sistema.

Su propósito es clasificar todos los movimientos de inventario, permitiendo:

- Validaciones del negocio.
- Reportes.
- Auditorías.
- Estadísticas.

Los registros iniciales serán creados automáticamente mediante el Seed de la base de datos.

## Tipos de Movimiento

Los valores iniciales serán:

- PURCHASE
- SALE
- TRANSFER_OUT
- TRANSFER_IN
- STAFF_DELIVERY
- ADJUSTMENT_IN
- ADJUSTMENT_OUT

# Relaciones de InventoryMovement
## InventoryMovement → Product

### Pregunta

¿Todo movimiento pertenece a un producto?

Sí.

### Relación

Product (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.productId

## InventoryMovement → Store

### Pregunta

¿Todo movimiento pertenece a una tienda?

Sí.

### Relación

Store (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.storeId

## InventoryMovement → User

### Pregunta

¿Todo movimiento tiene un usuario responsable?

Sí.

### Relación

User (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.userId

## InventoryMovement → Client

### Pregunta

¿Todo movimiento tiene un cliente?

No.

Solo los movimientos de tipo SALE estarán asociados a un cliente.

### Relación

Client (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.clientId

(Relación opcional)

## InventoryMovement → MovementType

### Pregunta

¿Todo movimiento tiene un tipo?

Sí.

### Relación

MovementType (1) → InventoryMovement (N)

### Llave foránea

InventoryMovement.movementTypeId

## Resumen

La entidad InventoryMovement tendrá las siguientes relaciones:

| Relación | Cardinalidad | Llave Foránea |
|----------|--------------|---------------|
| Product | 1 → N | InventoryMovement.productId |
| Store | 1 → N | InventoryMovement.storeId |
| User | 1 → N | InventoryMovement.userId |
| Client | 1 → N | InventoryMovement.clientId (Opcional) |
| MovementType | 1 → N | InventoryMovement.movementTypeId |

## Observación

InventoryMovement constituye el historial oficial del inventario.

Todo cambio en las existencias deberá generar un movimiento.

Una vez registrado y sincronizado, un movimiento no podrá modificarse ni eliminarse.

La información almacenada permitirá reconstruir completamente la trazabilidad del inventario.

## Flujo de un Movimiento

Todo movimiento seguirá el siguiente flujo:

Usuario

↓

Tienda

↓

Tipo de Movimiento

↓

Producto

↓

Cantidad

↓

Actualización de InventoryStock

↓

Registro permanente en InventoryMovement

## Ejemplo

Venta

Usuario:
Juan Pérez

↓

Tienda:
San Gabriel

↓

Producto:
Pezonera 300 cc

↓

Cantidad:
2

↓

Cliente:
Hacienda El Prado

↓

Tipo:
SALE

↓

Resultado:

- Se registra un nuevo InventoryMovement.
- Se actualiza InventoryStock.
- La operación queda disponible para auditoría y reportes.

# Diagrama General de Relaciones
 Role
                                 │
                                 │
                                 ▼
                               User
                                 │
                                 │
                                 ▼
                               Store
                                 │
                 ┌───────────────┴────────────────┐
                 │                                │
                 ▼                                ▼
        InventoryMovement                 InventoryStock
                 ▲                                ▲
                 │                                │
                 │                                │
              Product─────────────────────────────┘
                 │
      ┌──────────┼──────────────┐
      │          │              │
      ▼          ▼              ▼
 Category      Brand     UnitOfMeasure
      │
      ▼
 Category
(Subcategorías)

Product
      │
      ▼
ProductPrice
      ▲
      │
MarginProfile
      │
      ▼
    Client

    ## Explicación

El modelo se organiza alrededor de tres núcleos principales:

### Inventario

- Product
- InventoryMovement
- InventoryStock

### Organización

- Store
- User
- Role

### Comercial

- Client
- MarginProfile
- ProductPrice

Las entidades auxiliares (Category, Brand y UnitOfMeasure) complementan la información del producto.

## Flujo General del Sistema

Compra

Proveedor

↓

InventoryMovement (PURCHASE)

↓

InventoryStock

↓

Venta

Cliente

↓

MarginProfile

↓

ProductPrice

↓

InventoryMovement (SALE)

↓

InventoryStock

↓

Reportes

## Observaciones

El diagrama representa la arquitectura lógica del sistema.

No muestra tipos de datos ni detalles de implementación.

Su objetivo es facilitar la comprensión del dominio antes de construir el modelo físico de la base de datos.


# Verificación de Relaciones
## Cardinalidades

Se verificó que todas las relaciones documentadas representan correctamente el funcionamiento del negocio.

Resultado:

- User pertenece a un único Role.
- User pertenece a una única Store.
- Product pertenece a una única Category.
- Product pertenece a una única Brand.
- Product pertenece a una única UnitOfMeasure.
- Client pertenece a un único MarginProfile.
- InventoryMovement pertenece a un único Product.
- InventoryMovement pertenece a una única Store.
- InventoryMovement pertenece a un único User.
- InventoryMovement pertenece a un único MovementType.
- InventoryMovement puede pertenecer opcionalmente a un Client.

## Duplicidad de Información

Se verificó que no existen relaciones que dupliquen información.

Resultado:

- Product no almacena stock.
- Product no almacena precios.
- Product no almacena imágenes.
- Client no almacena precios.
- MarginProfile no almacena productos.
- InventoryMovement conserva únicamente el historial.
- InventoryStock almacena únicamente las existencias.

# Relaciones Circulares

Se verificó que el modelo no presenta ciclos innecesarios.

La única relación recursiva permitida corresponde a:

Category → Category

mediante el campo:

parentCategoryId

Esta relación fue diseñada para soportar categorías jerárquicas.

## Escalabilidad

El modelo permite incorporar nuevas funcionalidades sin modificar las relaciones existentes.

Ejemplos:

- Nuevos perfiles de margen.
- Nuevas marcas.
- Nuevas unidades de medida.
- Nuevas tiendas.
- Nuevos tipos de movimiento.
- Nuevas imágenes de productos.

## Inventario

Se verificó que el inventario cumple las siguientes reglas:

- Todo cambio del stock genera un InventoryMovement.
- InventoryStock representa el estado actual del inventario.
- InventoryMovement representa el historial.
- El stock nunca se modifica directamente en Product.

## Módulo Comercial

Se verificó que el cálculo de precios cumple la arquitectura definida.

- MarginProfile define los porcentajes de margen.
- ProductPrice almacena los precios calculados.
- Client únicamente referencia un MarginProfile.
- Las ventas utilizan los precios previamente calculados.

## Conclusión

Después de revisar todas las relaciones del modelo se concluye que:

- No existen datos duplicados.
- No existen relaciones innecesarias.
- No existen relaciones muchos a muchos para el MVP.
- Las responsabilidades de cada entidad están claramente separadas.
- El modelo está preparado para su implementación en Prisma y PostgreSQL.

# Relaciones Futuras
## Sistema de Permisos

En futuras versiones se incorporará un sistema de permisos basado en las siguientes entidades:

Role (N) ↔ (N) Permission

La relación será implementada mediante una entidad intermedia:

RolePermission

Esto permitirá asignar permisos específicos a cada rol sin modificar la lógica del sistema.

## Notificaciones

Se incorporará una entidad Notification para administrar:

- Alertas de stock.
- Sincronizaciones.
- Mensajes del sistema.
- Avisos importantes.

Relación:

User (1) → Notification (N)

## Historial de Equipos

En una versión posterior se incorporará un módulo para administrar el historial de los equipos vendidos.

Las principales entidades serán:

Equipment

EquipmentService

Las relaciones previstas serán:

Client (1) → Equipment (N)

Equipment (1) → EquipmentService (N)

Esto permitirá consultar:

- Fecha de venta.
- Fecha de entrega.
- Número de serie.
- Modelo.
- Historial de mantenimientos.
- Historial de reparaciones.

## Imágenes de Productos

La entidad ProductImage permitirá asociar múltiples imágenes a un producto.

Relación:

Product (1) → ProductImage (N)

Esta funcionalidad no será implementada en el MVP.

## Observaciones

Las relaciones documentadas en esta sección forman parte de la arquitectura objetivo del ERP.

No serán implementadas durante el MVP, pero el modelo de datos fue diseñado para incorporarlas sin realizar cambios estructurales en las entidades principales.

# Validación Final
## Relaciones Principales

- [x] Todo User pertenece a un Role.
- [x] Todo User pertenece a una Store.
- [x] Todo Product pertenece a una Category.
- [x] Todo Product pertenece a una Brand.
- [x] Todo Product pertenece a una UnitOfMeasure.
- [x] Todo Client pertenece a un MarginProfile.
- [x] Todo InventoryMovement pertenece a un Product.
- [x] Todo InventoryMovement pertenece a un User.
- [x] Todo InventoryMovement pertenece a una Store.
- [x] Todo InventoryMovement pertenece a un MovementType.
- [x] Client es opcional únicamente para movimientos de tipo SALE.

## Inventario

- [x] Product no almacena stock.
- [x] InventoryStock almacena el stock actual.
- [x] InventoryMovement almacena el historial.
- [x] Todo cambio del inventario genera un InventoryMovement.
- [x] Las transferencias entre tiendas generan dos movimientos:
  - TRANSFER_OUT
  - TRANSFER_IN

  ## Sistema de Precios

- [x] MarginProfile administra los porcentajes de margen.
- [x] ProductPrice almacena los precios calculados.
- [x] Client solo referencia un MarginProfile.
- [x] Product no almacena precios de venta.
- [x] Los usuarios de tienda únicamente consultarán precios ya calculados.

## Auditoría

- [x] Todas las entidades principales utilizan UUID.
- [x] Todas las entidades principales incluyen auditoría.
- [x] Todas las entidades principales utilizan Soft Delete.
- [x] Ningún movimiento de inventario podrá eliminarse físicamente.

## Escalabilidad

El modelo queda preparado para incorporar en futuras versiones:

- [x] Sistema de permisos.
- [x] Historial de equipos.
- [x] Notificaciones.
- [x] Múltiples imágenes por producto.

## Conclusión

Después de revisar todas las relaciones del modelo se concluye que:

- El modelo representa correctamente el funcionamiento del negocio.
- No existen relaciones duplicadas.
- No existen dependencias circulares innecesarias.
- Cada entidad tiene una única responsabilidad.
- La arquitectura está preparada para implementarse en Prisma y PostgreSQL.

La Fase 3 se considera validada.

# Cierre de la Fase 3
## Estado

La Fase 3 – Relaciones ha finalizado correctamente.

Se encuentran documentadas:

- Todas las relaciones del modelo.
- Todas las cardinalidades.
- Todas las llaves foráneas.
- El diagrama conceptual del dominio.
- Las relaciones previstas para futuras versiones.

## Arquitectura Aprobada

El modelo relacional aprobado incluye las siguientes entidades:

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

Todas las relaciones fueron revisadas y validadas antes de iniciar la implementación del modelo físico de la base de datos.

## Decisiones Confirmadas

Durante el diseño se aprobaron las siguientes decisiones de arquitectura:

- El stock será administrado por InventoryStock.
- Product no almacenará existencias.
- Product no almacenará precios de venta.
- Los precios serán calculados y almacenados en ProductPrice.
- MarginProfile administrará los perfiles de margen.
- Los usuarios de tienda únicamente visualizarán precios previamente calculados.
- Las transferencias entre tiendas generarán dos movimientos:
  - TRANSFER_OUT
  - TRANSFER_IN
- Las categorías soportarán jerarquías mediante parentCategoryId.
- Brand y UnitOfMeasure serán entidades independientes.
## Próxima Fase

El proyecto queda preparado para iniciar el diseño físico de la base de datos e implementar el modelo en Prisma.

Toda modificación futura deberá respetar las decisiones documentadas durante las Fases 1, 2 y 3.