# Entidad: Settings

## Descripción

Almacena la configuración general del sistema.

Esta entidad centraliza los parámetros utilizados por toda la aplicación.

Existirá un único registro de configuración.

# Atributos

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id | BIGINT | Sí | Identificador interno |
| uuid | UUID | Sí | Identificador global |
| companyName | VARCHAR | Sí | Nombre de la empresa |
| currency | VARCHAR | Sí | Moneda utilizada |
| syncInterval | INTEGER | Sí | Intervalo de sincronización (minutos) |
| lowStockAlert | BOOLEAN | Sí | Activar alerta de stock mínimo |
| reportLogo | VARCHAR | No | Ruta del logotipo para reportes |
| isActive | BOOLEAN | Sí | Estado |
| createdAt | DATETIME | Sí | Fecha de creación |
| updatedAt | DATETIME | Sí | Fecha de actualización |
| createdBy | FK | No | Usuario creador |
| updatedBy | FK | No | Último usuario editor |

# Reglas del Negocio

- Solo existirá un registro de configuración.
- Solo el Administrador podrá modificar la configuración.
- La moneda deberá estar definida antes de utilizar el sistema.
- El intervalo de sincronización deberá ser mayor que cero.

# Relaciones

Settings no posee relaciones directas con otras entidades.

Sus valores serán consultados por diferentes módulos del sistema.

# Índices

- uuid (Único)
- isActive

# Observaciones

La entidad Settings almacenará únicamente configuraciones globales.

No contendrá preferencias personales de los usuarios.

La aplicación cargará esta configuración al iniciar para garantizar un comportamiento uniforme en todos los módulos.