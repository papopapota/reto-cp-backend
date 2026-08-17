# Architecture

## Patrón de arquitectura: ¿Qué patrón usaste? ¿Por qué lo elegiste para este proyecto?
Patron elegido: Arquitectura hexagonal(puertos y adaptadores).
Razón: se elegio este patron por su gran capacidad para mantener la deuda técnica baja y la capacidad de separación de capas de dominio, negocio y aplicación, consiguiendo que la implementación o cambio de features sea más mantenible con el tiempo.

## Diagrama: Incluye un diagrama que muestre los componentes principales y cómo se comunican.

El sistema está diseñado bajo los principios de **Clean Architecture (Arquitectura Limpia) / Arquitectura Hexagonal**, dividiendo la aplicación en capas concéntricas con regla de dependencia unidireccional hacia el dominio.

```
                  ┌───────────────────────────────────────────────┐
                  │                 CLIENTE HTTP                  │
                  └───────────────────────┬───────────────────────┘
                                          │  JSON / HTTP Requests
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ CAPA DE INFRAESTRUCTURA (Adapters Primarios / Entrada)                          │
│                                                                                 │
│  ┌───────────────────────┐  ┌─────────────────────────┐  ┌───────────────────┐  │
│  │   MovieController     │  │   ShowtimeController    │  │ BookingController │  │
│  └───────────┬───────────┘  └────────────┬────────────┘  └─────────┬─────────┘  │
│              │ ValidationPipe            │ ParseUUIDPipe           │            │
└──────────────┼───────────────────────────┼─────────────────────────┼────────────┘
               ▼                           ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ CAPA DE APLICACIÓN (Use Cases / DTOs)                                           │
│                                                                                 │
│  ┌───────────────────────┐  ┌─────────────────────────┐  ┌───────────────────┐  │
│  │ CreateMovieUseCase    │  │ CreateShowtimeUseCase   │  │ CreateBookingUC   │  │
│  │ UpdateMovieUseCase    │  │ ListShowtimesUseCase    │  │ GetBookingUC      │  │
│  └───────────┬───────────┘  └────────────┬────────────┘  └─────────┬─────────┘  │
│              │                           │                         │            │
└──────────────┼───────────────────────────┼─────────────────────────┼────────────┘
               ▼                           ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ CAPA DE DOMINIO (Entities / Value Objects / Ports / Domain Exceptions)          │
│                                                                                 │
│  ┌───────────────────────┐  ┌─────────────────────────┐  ┌───────────────────┐  │
│  │ Movie (Entity)        │  │ Showtime (Entity)       │  │ Booking (Entity)  │  │
│  │ MovieRepositoryPort   │  │ ShowtimeRepositoryPort  │  │ BookingRepoPort   │  │
│  └───────────────────────┘  └─────────────────────────┘  └───────────────────┘  │
└──────────────────────────────────────▲──────────────────────────────────────────┘
                                       │ Implementa interfaces (Inversión de Dep.)
┌──────────────────────────────────────┴──────────────────────────────────────────┐
│ CAPA DE INFRAESTRUCTURA (Adapters Secundarios / Salida & Persistencia)          │
│                                                                                 │
│  ┌───────────────────────┐  ┌─────────────────────────┐  ┌───────────────────┐  │
│  │ PrismaMovieRepository │  │ PrismaShowtimeRepository│  │ PrismaBookingRepo │  │
│  └───────────┬───────────┘  └────────────┬────────────┘  └─────────┬─────────┘  │
│              │                           │                         │            │
│              └───────────────────────────┼─────────────────────────┘            │
│                                          ▼                                      │
│                                 PrismaService (ORM)                             │
└──────────────────────────────────────────┬──────────────────────────────────────┘
                                           │ Native MongoDB Driver
                                           ▼
                  ┌───────────────────────────────────────────────┐
                  │              MONGODB DATABASE                 │
                  │   [movies]     [showtimes]     [bookings]     │
                  └───────────────────────────────────────────────┘

```
### Flujo de Comunicación entre Componentes

1. **Entrada:** El cliente HTTP envía una petición que pasa por Pipes globales (`ValidationPipe`, `ParseUUIDPipe`) para sanitización y validación de tipos.
2. **Controlador:** Recibe el DTO validado y delega la ejecución al Caso de Uso correspondiente.
3. **Caso de Uso:** Orquesta la lógica de negocio (validación de fechas pasadas, cálculo de solapamiento de salas, reservas atómicas) interactuando exclusivamente con interfaces de Dominio (`*RepositoryPort`).
4. **Dominio:** Contiene las entidades puras, excepciones de negocio y contratos de persistencia, sin acoplamiento a librerías externas o frameworks.
5. **Persistencia (Adapters):** Las implementaciones concretas (`Prisma*Repository`) implementan los puertos de dominio, ejecutan consultas o transacciones atómicas mediante `PrismaService` y retornan entidades de dominio a través de Mappers (`toDomain`).


## Decisiones técnicas: Justifica tu elección de base de datos, framework, y cualquier librería relevante.

### Framework: NestJS con TypeScript

* **Inyección de Dependencias Nativa (IoC):** Facilita la aplicación del principio de inversión de dependencias de Clean Architecture desacoplando los Casos de Uso de la implementación de la base de datos mediante tokens (`@Inject(SHOWTIME_REPOSITORY_PORT)`).
* **Modularidad y Mantenibilidad:** La arquitectura modular (`MovieModule`, `ShowtimeModule`, `BookingModule`) delimita responsabilidades claras por contexto delimitado (*Bounded Context*).
* **Tipado Estricto con TypeScript:** Previene errores de consistencia de datos en tiempo de compilación y robustece el modelado del dominio mediante tipos utilitarios (`Pick`, `Partial`).

### Base de Datos: MongoDB

* **Modelo Orientado a Documentos:** Permite almacenar entidades de catálogo y eventos con esquemas flexibles y alta velocidad de lectura.
* **Escalabilidad Horizontal:** Excelente rendimiento para plataformas de consulta masiva de funciones y cartelera de cine con baja latencia.
* **Consistencia Transaccional (Multi-Document Transactions):** Soporta sesiones transaccionales mediante motores de replicación, permitiendo garantizar atomicidad en el flujo crítico de reserva de asientos.

### ORM / Acceso a Datos: Prisma ORM

* **Seguridad de Tipos de Extremo a Extremo (Type-Safety):** Prisma genera tipos estáticos automáticos a partir de `schema.prisma`, eliminando discrepancias entre los modelos de la base de datos y el código TypeScript.
* **Prevención de Condiciones de Carrera:** Soporta operaciones atómicas nativas (`decrement`, `updateMany` condicional) y transacciones interactivas (`prisma.$transaction`), indispensables para evitar la sobreventa (*overbooking*) de asientos bajo alta concurrencia.
* **Optimización de Consultas:** Permite resolver relaciones mediante `include` en una sola consulta, mitigando el problema de consultas $N+1$ en endpoints complejos como la consulta de funciones con películas asociadas.

### Librerías Relevantes

| Librería / Herramienta | Rol en el Proyecto | Justificación |
| --- | --- | --- |
| **`class-validator` & `class-transformer**` | Validación de DTOs | Valida automáticamente tipos, rangos numéricos, fechas ISO-8601 y formato UUID v4 a la entrada de la API antes de tocar la lógica de negocio. |
| **`jest`  | Pruebas Unitarias | Permite ejecutar suites de pruebas unitarias ultra rápidas aislando dependencias mediante mocks de repositorios y validando casos límite (fechas pasadas, solapamientos, asientos insuficientes). |
| **UUID (v4)** | Identificadores Únicos Universales | Evita la exposición de IDs autoincrementales secuenciales, previniendo ataques de enumeración y facilitando la idempotencia en entornos distribuidos. |

---

# Consideraciones de Resiliencia y Concurrencia

* **Control de Sobreventa (Race Conditions):** Se implementó una verificación atómica con filtro de condición en MongoDB (`availableSeats >= seatsToDeduct`) dentro de una transacción interactiva de Prisma, garantizando que dos reservas simultáneas para el último asiento no generen estados inconsistentes.
* **Cálculo de Solapamiento de Salas:** La lógica temporal calcula intervalos considerando la duración de la película más un margen de limpieza (*cleaning buffer* de 15 minutos), asegurando disponibilidad física real de las salas antes de programar una nueva función.