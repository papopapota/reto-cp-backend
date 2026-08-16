# Reto Cine Planet Backend

API REST para la gestión de reservas y operaciones del sistema de Cineplanet, desarrollada como solución al reto técnico de backend.

## 1. Stack Tecnológico
### Técnologias Principales
- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **ORM / ODM:** Prisma
- **Base de Datos:** MongoDB

### Tecnologías Secundarias y Librerías
- **Testing:** Jest
- **Validación de Entorno:** Joi / Dotenv
- **Seguridad y Autenticación:** JWT (JSON Web Tokens) y Bcrypt
- **Documentación de API:** Swagger (OpenAPI 3.0 via `@nestjs/swagger`)
- **Contenedores:** Docker y Docker Compose

## 2. Instrucciones de Ejecución Local

### Prerrequisitos
- Docker y Docker Compose instalados.
- Node.js (opcional, en caso de ejecución sin contenedor).

### Pasos para levantar el entorno
1. Clonar el repositorio y ubicarse en la raíz del proyecto.
2. Crear el archivo de variables de entorno a partir de la plantilla:
   ```bash
   cp .env.template .env
   ```
3. Ajustar los valores en el archivo `.env` en caso de ser necesario.
4. Levantar la aplicación y la base de datos con Docker Compose:
```bash
docker compose up --build

```
5. La API estará disponible en `http://localhost:3000` (o el puerto configurado en `PORT`).
6. ejecutar el comando para repoblar la db
```
   pnpm exec prisma db seed
```
## 3. Variables de Entorno

| Variable | Descripción | Valor por defecto / Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto en el que se ejecuta la aplicación | `3000` |
| `ENVIRONMENT` | Entorno de ejecución (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | URI de conexión a la base de datos MongoDB | `mongodb://root:root@localhost:27017/reto-cp-backend?authSource=admin` |
| `JWT_SECRET` | Clave secreta para la firma y validación de tokens JWT | `tu_clave_secreta_aqui` |


## 4. Despliegue y Documentación

### URL de despliegue público
https://reto-cp-backend.onrender.com/

### Enlace de Swagger
https://reto-cp-backend.onrender.com/api/docs

## Referencia al archivo postman y enviroment

## 6. Respuestas al Escenario de Escalabilidad (Sección 4.1)

### 1. ¿Cómo garantizarías que no se vendan más asientos de los disponibles bajo alta concurrencia?

* **Control de stock en memoria distribuida (Redis):** Se consulta el inventario en Redis; si no existe, se carga desde la base de datos. Para decrementos de stock concurrentes se utilizan scripts en Lua, los cuales se ejecutan de manera atómica en un solo hilo en Redis, eliminando condiciones de carrera (*race conditions*) antes de tocar la base de datos.
* **Bloqueo temporal de asientos (*Distributed Lock / TTL*):** Al seleccionar un asiento, se genera una clave temporal en Redis (ej. `seat:{id}:lock`) asignada al `userId` con un TTL de 5 a 10 minutos. Si la clave ya existe, el asiento se rechaza de inmediato. Si el pago no se confirma antes de expirar el TTL, la clave se destruye y el asiento queda libre de forma automática.
* **Operaciones atómicas a nivel de base de datos:** Para la persistencia final, se ejecutan operaciones de actualización condicional atómica (ej. `findAndModify` / `updateOne` con filtro de estado `DISPONIBLE`), asegurando que solo una transacción consolide el cambio de estado.

### 2. ¿Qué cambios harías a la arquitectura actual para soportar esta carga sin interrupciones?

* **Desacoplamiento asíncrono con arquitectura orientada a eventos:** Reemplazar llamadas HTTP síncronas pesadas mediante colas de mensajería (ej. RabbitMQ, Apache Kafka o AWS SQS). Esto permite amortiguar picos de tráfico y procesar las compras mediante *consumers* a un ritmo controlado.
* **Estrategia de caché multinivel:** Implementar caché distribuida en Redis para consultas de solo lectura de alta frecuencia (cartelera, cines, horarios), reduciendo drásticamente la carga de lectura en la base de datos.
* **Escalabilidad horizontal y orquestación:** Empaquetar los servicios en contenedores y desplegarlos en un orquestador (Kubernetes / ECS) configurando métricas de autoescalado horizontal (HPA) basadas en uso de CPU y volumen de peticiones por segundo.

### 3. ¿Qué tecnologías o patrones adicionales introducirías?

* **Idempotency Keys:** Encabezados de idempotencia en peticiones de reserva y pasarela de pagos para evitar cobros o reservas duplicadas en reintentos de red.
* **Patrón Circuit Breaker:** Implementar mecanismos de tolerancia a fallos para aislar servicios externos inestables (como pasarelas de pago o proveedores de facturación).
* **Descomposición en Microservicios:** Separar los módulos de alta demanda (como el motor de reservas y pagos) de los módulos de baja demanda (catálogo y administración).
* **Patrón Saga:** Orquestar transacciones distribuidas compensatorias entre servicios (reserva de asiento, cobro y emisión de boleto) para mantener la consistencia eventual sin recurrir a bloqueos pesados en la base de datos.

---


## 7. Arquitectura del Sistema

Para conocer en detalle el diseño de componentes, capas, justificación técnica de decisiones y diagramas del sistema, consulta el documento:

* [ARCHITECTURE.md](./ARCHITECTURE.md)

