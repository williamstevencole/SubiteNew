# 🚌 SubiTe — README de Funcionalidad

> Plataforma B2B para gestión de transporte privado (multi-empresa, multi-rol) con seguimiento en tiempo real, control de asistencia vía QR y reportes operativos.

---

## 1) Qué es SubiTe (en una línea)

SubiTe permite que una **empresa transportista (gestor)** administre sus **clientes (empresas atendidas)**, **vehículos**, **motoristas** y **pasajeros**, coordinando **rutas diarias** con **seguimiento en vivo** y **asistencia controlada**.

---

## 2) Roles y permisos

* **Manager (Gestor)**

  * Crea/edita **companies**, **users** (drivers/passengers), **vehicles**.
  * Define **schedules** y genera **daily routes**.
  * Ve **mapas en vivo**, **historial** y **reportes**.
  * Administra **assets** (fotos, docs) y notificaciones.

* **Driver (Motorista)**

  * Inicia/finaliza **daily route** asignada.
  * Publica **posición** cada ~5s.
  * Ve **lista de pasajeros** esperados.
  * **Escanea QR** para marcar asistencia.

* **Passenger (Pasajero)**

  * Inicia sesión con cuenta creada por el gestor.
  * Configura **días/horas** de transporte y **direcciones** (home/destination).
  * Ve el **bus en tiempo real**, recibe alertas y confirma presencia con **QR**.

> Nota: El **pasajero no crea su cuenta**; el gestor la crea y habilita.

---

## 3) Flujo funcional (end-to-end)

### 3.1 Alta y configuración

1. El **gestor** contrata SubiTe y recibe un **workspace** (multi-tenant).
2. Crea **companies** (clientes atendidos), **vehicles** y **users** (drivers/passengers).
3. Configura **schedules** por company (horarios/ventanas de operación).

### 3.2 Preferencias del pasajero

4. El **pasajero** (ya creado) inicia sesión.
5. Indica **días/horas** que necesita transporte y registra **direcciones** (home/work/university).
6. El sistema planifica **DailyRoutes** con base en company, schedule y demanda.

### 3.3 Operación diaria

7. El **driver** inicia su **DailyRoute** → la app empieza a enviar **GPS** cada 5s.
8. El **backend** valida y **emite por sockets** la posición a todos los suscritos (manager/pasajeros).
9. El **snapshot** de la última posición se guarda en `DailyRoute` y el **historial** en `TripPosition`.

### 3.4 Abordaje y asistencia

10. El **pasajero** muestra su **QR**; el **driver** escanea y SubiTe marca **RouteAttendance** (una vez por ruta).
11. El manager supervisa estado, retrasos y pasajeros a bordo.

### 3.5 Cierre y reportes

12. El **driver** finaliza la ruta.
13. El backend resume en `TripTrace` (distancia, duración, polyline) y genera **reportes** de puntualidad/uso.

---

## 4) Módulos funcionales

### 4.1 Gestión de empresas y usuarios

* **Companies**: nombre único, estado, datos de contacto.
* **Users**: `role ∈ {MANAGER, DRIVER, PASSENGER}`; pertenecen a una `company`.
* **Vehicles**: placa única, activo/inactivo, driver asignado.

### 4.2 Schedules y rutas diarias

* **Company schedules**: ventanas de operación (texto/JSON).
* **User schedules**: días/horas solicitadas por pasajero.
* **DailyRoute**: entidad operativa del día (fecha, vehicle, driver, estado, snapshot de última posición).

### 4.3 Realtime (Sockets)

* **Rooms** por `route:<dailyRouteId>`.
* Driver envía `position` → backend valida → **broadcast** `position:update`.
* Persistencia **en lote** (opcional worker) a `TripPosition`.

### 4.4 Asistencia (QR)

* **Codigo QR por usuario**: hash y expiración.
* **Scan** en el bus → `RouteAttendance` (`UNIQUE(dailyRouteId, userId)`).

### 4.5 Storage (Supabase Storage)

* **Buckets** privados, acceso por **signed URLs**.
* Tabla `FileAsset` referencia: `bucketKey`, `purpose`, `ownerUser/company/vehicle`.

### 4.6 Notificaciones

* **Expo Push / FCM**: “bus cerca”, “ruta iniciada/finalizada”, “cambio de horario”.

### 4.7 Reportes

* **Operación**: rutas por día/vehículo/driver.
* **Uso**: asistencia real vs planificada.
* **Puntualidad**: hora real vs programada.

---

## 5) Reglas de negocio (destacadas)

* Un **passenger** solo pertenece a **una company** (o a varias si activas tabla puente; por ahora 1:1).
* Una **placa** es **única**.
* **Asistencia**: solo **una vez** por `DailyRoute` y `Passenger`.
* **Snapshots** en `DailyRoute` para lecturas rápidas; **historial** en `TripPosition`.
* **Rate limiting** para posiciones (evitar spam y ahorrar batería/datos).
* **Idempotencia** en operaciones críticas (QR/abordaje).

---

## 6) Datos (visión funcional)

> Nombres en **inglés** para tablas y campos.

* **Company**: `{ id, name, createdAt, updatedAt }`
* **User**: `{ id, email, role, companyId, authId?, notificationId?, ... }`
* **Vehicle**: `{ id, plate, active, companyId, driverId? }`
* **DailyRoute**: `{ id, date, companyId, vehicleId, driverId, status, lastLat?, lastLng?, lastPositionAt? }`
* **TripPosition**: `{ id, dailyRouteId, t, lat, lng, speed?, heading? }`
* **TripTrace**: `{ id, dailyRouteId, polyline, points, distanceM?, durationS? }`
* **RouteAttendance**: `{ id, dailyRouteId, userId, boarded }`
* **FileAsset**: `{ id, purpose, bucketKey, mimeType, isPublic, ownerUserId?, companyId?, vehicleId? }`

---

## 7) API (vista funcional, no exhaustiva)

* **Auth**

  * `POST /auth/login` → JWT (access/refresh).
* **Companies/Users/Vehicles**

  * `POST /companies` | `GET /companies/:id`
  * `POST /users` (manager crea driver/passenger)
  * `POST /vehicles` | `PATCH /vehicles/:id`
* **Schedules**

  * `POST /companies/:id/schedules`
  * `POST /users/:id/schedules`
* **Daily routes**

  * `POST /daily-routes` (generar)
  * `GET /daily-routes/:id`
  * `PATCH /daily-routes/:id/status` (start/finish)
* **Realtime**

  * `WS /ws`

    * `join:route` `{ dailyRouteId }`
    * `position` `{ dailyRouteId, lat, lng, t?, speed?, heading? }`
    * evento salida: `position:update`
* **Attendance**

  * `POST /attendance/scan` `{ dailyRouteId, userQrHash }`
* **Files (Storage)**

  * `POST /files/upload-url` `{ purpose, mimeType, entityId? }` → signed URL
  * `GET /files/:id/download-url` → signed URL
* **Reports**

  * `GET /reports/daily-route/:id`
  * `GET /reports/company/:id?from=...&to=...`

---

## 8) Móvil (flujos clave)

* **Manager**: dashboard, empresas, vehículos, rutas de hoy, mapa en vivo, reportes.
* **Driver**: “My Route Today” → **Start** → envía `position` → **Scan QR** → **Finish**.
* **Passenger**: selecciona días/horas, ve bus en vivo, muestra QR al abordar.

---

## 9) No-funcionales

* **Seguridad**: JWT (access 15m / refresh 30d), RBAC por rol y company.
* **Escalabilidad**: Socket.IO con adapter Redis si hay varias instancias.
* **Observabilidad**: logs estructurados, métricas básicas (p99 de `position`).
* **Backups**: DB snapshots automáticos (según entorno).
* **Privacidad**: todos los archivos **privados**; solo por signed URLs (expiran).

---

## 10) Roadmap corto

* Panel web de gestión (Next.js).
* PostGIS para proximidad y ETA.
* Recordatorios “bus a 5 min” (BullMQ).
* Export de reportes (CSV/PDF).
* Multi-company por pasajero (si negocio lo pide).

---

## 11) Convenciones

* **Nombres en inglés** (tablas/campos).
* **PascalCase en modelos Prisma / snake_case en DB opcional** (Prisma mapea bien).
* **Endpoints REST** con **Zod** para validación.
* **Sockets**: `route:<id>` rooms.

---

## 12) Demo mínima (qué debe verse funcionando)

1. Manager crea **Company**, **Vehicle** (con placa), **Driver**, **Passenger**.
2. Genera **DailyRoute** (hoy) para ese vehicle/driver.
3. Driver hace **Start** → RN empieza a emitir `position` cada 5s.
4. Passenger se suscribe y ve **position:update** en el mapa.
5. Driver **escanea QR** del passenger → asistencia marcada.
6. Driver **Finish** → `TripTrace` generado → reporte básico visible.
