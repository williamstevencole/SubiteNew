# 📊 SUBITE Database Schema

> **Sistema de gestión de transporte escolar y corporativo**

Este documento explica el propósito y estructura de cada tabla en la base de datos de SUBITE.

---

## 🗂️ Índice de Tablas

1. [companies](#1-companies) - Empresas del sistema
2. [users](#2-users) - Usuarios (gerentes, conductores, pasajeros)
3. [vehicles](#3-vehicles) - Vehículos de transporte
4. [company_schedules](#4-company_schedules) - Horarios de las empresas
5. [trips](#5-trips) - Viajes/Rutas diarias
6. [trip_positions](#6-trip_positions) - Tracking GPS en tiempo real
7. [user_addresses](#7-user_addresses) - Direcciones de los usuarios
8. [user_schedules](#8-user_schedules) - Asignación de usuarios a horarios
9. [attendances](#9-attendances) - Asistencia de pasajeros

---

## 📋 Descripción de Tablas

### 1. **companies**
**Propósito:** Almacena las empresas que usan el sistema de transporte.

**Estructura:**
```sql
companies
├── id (BIGINT, PK)
├── created_at (TIMESTAMP)
└── name (TEXT, UNIQUE) - Nombre de la empresa
```

**Uso:**
- Cada empresa tiene sus propios usuarios, vehículos y rutas
- Aislamiento de datos por empresa (multi-tenancy)
- Ejemplos: "Transporte UNITEC", "Transporte Grupo Paz"

**Relaciones:**
- `1 → N` con `users` (una empresa tiene muchos usuarios)
- `1 → N` con `vehicles` (una empresa tiene muchos vehículos)
- `1 → N` con `trips` (una empresa tiene muchos viajes)
- `1 → N` con `company_schedules` (una empresa tiene muchos horarios)

---

### 2. **users**
**Propósito:** Todos los usuarios del sistema (gerentes, conductores, pasajeros).

**Estructura:**
```sql
users
├── id (BIGINT, PK)
├── created_at (TIMESTAMP)
├── name (VARCHAR) - Nombre completo
├── phone (VARCHAR) - Teléfono
├── email (TEXT, UNIQUE) - Email para login
├── password_hash (TEXT) - Contraseña encriptada (bcrypt)
├── role (ENUM) - MANAGER, DRIVER, PASSENGER
├── status (ENUM) - NO_ROUTES, ON_ROUTE, OUT_OF_SERVICE
├── notification_id (TEXT, UNIQUE) - Token de notificaciones push
├── company_id (BIGINT, FK) - Empresa a la que pertenece
├── qr_code (TEXT, UNIQUE) - Código QR único del usuario
└── photo_url (TEXT) - URL de la foto de perfil
```

**Roles:**
- **MANAGER**: Gerente/Administrador - puede gestionar toda la empresa
- **DRIVER**: Conductor - asignado a vehículos y rutas
- **PASSENGER**: Pasajero - usa el transporte

**Estados:**
- **NO_ROUTES**: No tiene rutas asignadas
- **ON_ROUTE**: Está en una ruta activa
- **OUT_OF_SERVICE**: Fuera de servicio (conductor) o inactivo

**Uso:**
- El `qr_code` se usa para check-in rápido en el vehículo
- El `notification_id` permite enviar notificaciones push
- La contraseña se encripta automáticamente con bcrypt (12 rounds)

**Relaciones:**
- `N → 1` con `companies` (muchos usuarios pertenecen a una empresa)
- `1 → N` con `vehicles` (un conductor puede tener múltiples vehículos asignados)
- `1 → N` con `trips` (un conductor puede tener múltiples viajes)
- `1 → N` con `user_addresses` (un usuario puede tener múltiples direcciones)
- `1 → N` con `attendances` (un pasajero tiene múltiples registros de asistencia)

---

### 3. **vehicles**
**Propósito:** Vehículos de transporte (buses, vans, etc).

**Estructura:**
```sql
vehicles
├── id (BIGINT, PK)
├── created_at (TIMESTAMP)
├── name (TEXT) - Nombre del vehículo (ej: "Bus A1")
├── driver_id (BIGINT, FK, NULLABLE) - Conductor asignado
├── plate (TEXT) - Placa del vehículo
├── active (BOOLEAN) - Si está activo o fuera de servicio
├── company_id (BIGINT, FK) - Empresa dueña
└── photo_url (TEXT) - Foto del vehículo
```

**Uso:**
- Un vehículo puede o no tener un conductor asignado
- `active = false` significa que está en mantenimiento o fuera de servicio
- La foto ayuda a los pasajeros a identificar el vehículo

**Relaciones:**
- `N → 1` con `companies` (muchos vehículos pertenecen a una empresa)
- `N → 1` con `users` (un vehículo puede tener un conductor asignado)
- `1 → N` con `trips` (un vehículo puede hacer múltiples viajes)

---

### 4. **company_schedules**
**Propósito:** Horarios de operación de la empresa (entrada/salida).

**Estructura:**
```sql
company_schedules
├── id (BIGINT, PK)
├── created_at (TIMESTAMP)
├── company_id (BIGINT, FK) - Empresa
├── time (TEXT) - Hora (formato "HH:MM", ej: "07:00")
└── schedule_type (ENUM) - ARRIVAL (entrada) o DEPARTURE (salida)
```

**Uso:**
- Define los horarios en que opera la empresa
- Ejemplo: "07:00 ARRIVAL" = horario de entrada de las 7:00 AM
- Los viajes (`trips`) se basan en estos horarios

**Relaciones:**
- `N → 1` con `companies` (muchos horarios por empresa)
- `1 → N` con `trips` (un horario genera muchos viajes)
- `1 → N` con `user_schedules` (usuarios asignados a horarios)

---

### 5. **trips**
**Propósito:** Viajes/rutas diarias (representa un viaje específico en una fecha).

**Estructura:**
```sql
trips
├── id (BIGINT, PK)
├── company_schedule_id (BIGINT, FK) - Horario base
├── company_id (BIGINT, FK) - Empresa (desnormalizado para queries rápidas)
├── date (DATE) - Fecha del viaje
├── driver_id (BIGINT, FK, NULLABLE) - Conductor asignado
├── vehicle_id (BIGINT, FK, NULLABLE) - Vehículo asignado
├── status (ENUM) - PENDING, IN_PROGRESS, COMPLETED, CANCELLED
├── started_at (TIMESTAMP, NULLABLE) - Cuándo empezó el viaje
└── completed_at (TIMESTAMP, NULLABLE) - Cuándo terminó
```

**Estados:**
- **PENDING**: Programado pero no ha iniciado
- **IN_PROGRESS**: En curso
- **COMPLETED**: Finalizado
- **CANCELLED**: Cancelado

**Uso:**
- Representa UN viaje específico en UNA fecha
- Ejemplo: "Viaje del Bus A1 el 2025-10-07 a las 07:00"
- Los timestamps permiten calcular duración del viaje

**Relaciones:**
- `N → 1` con `companies` (muchos viajes por empresa)
- `N → 1` con `company_schedules` (basado en un horario)
- `N → 1` con `users` (conductor)
- `N → 1` con `vehicles` (vehículo usado)
- `1 → N` con `trip_positions` (posiciones GPS del viaje)
- `1 → N` con `attendances` (asistencia de pasajeros)

---

### 6. **trip_positions**
**Propósito:** Tracking GPS en tiempo real del vehículo durante el viaje.

**Estructura:**
```sql
trip_positions
├── id (BIGINT, PK)
├── trip_id (BIGINT, FK) - Viaje al que pertenece
├── latitude (DOUBLE) - Latitud GPS
├── longitude (DOUBLE) - Longitud GPS
├── speed (DOUBLE, NULLABLE) - Velocidad en km/h
├── heading (DOUBLE, NULLABLE) - Dirección en grados (0-360)
├── accuracy (DOUBLE, NULLABLE) - Precisión GPS en metros
└── timestamp (TIMESTAMP) - Cuándo se capturó la posición
```

**Uso:**
- El conductor/vehículo envía su posición cada 5-30 segundos
- Permite:
  - **Tracking en tiempo real**: ver dónde está el bus AHORA
  - **Historial de ruta**: reproducir el recorrido completo
  - **Análisis**: velocidad promedio, tiempo en tráfico, etc.

**Ejemplo de datos:**
```
Trip #123 (Bus A1, 2025-10-07)
├─ 07:00:00 → (6.244, -75.581) - 0 km/h (parado)
├─ 07:05:00 → (6.250, -75.575) - 42 km/h
├─ 07:10:00 → (6.255, -75.570) - 38 km/h
└─ 07:30:00 → (6.260, -75.565) - 0 km/h (parado)
```

**Relaciones:**
- `N → 1` con `trips` (muchas posiciones por viaje)

**Índices:**
- `trip_id` - Para buscar todas las posiciones de un viaje
- `timestamp` - Para ordenar cronológicamente
- `(trip_id, timestamp)` - Combinado para queries rápidas

---

### 7. **user_addresses**
**Propósito:** Direcciones de los usuarios (casa, trabajo, etc).

**Estructura:**
```sql
user_addresses
├── id (BIGINT, PK)
├── created_at (TIMESTAMP)
├── user_id (BIGINT, FK) - Usuario dueño
├── address_type (ENUM) - HOME, WORK, OTHER
├── address (TEXT) - Dirección legible (ej: "Calle 10 #45-23")
├── latitude (DOUBLE) - Latitud
├── longitude (DOUBLE) - Longitud
└── updated_at (TIMESTAMP)
```

**Uso:**
- Define las paradas donde el vehículo debe recoger/dejar pasajeros
- Permite al conductor ver la ruta óptima
- Los pasajeros pueden tener múltiples direcciones (casa, trabajo)

**Relaciones:**
- `N → 1` con `users` (un usuario puede tener múltiples direcciones)

---

### 8. **user_schedules**
**Propósito:** Asigna usuarios (pasajeros) a horarios específicos de la empresa.

**Estructura:**
```sql
user_schedules
├── id (BIGINT, PK)
├── created_at (TIMESTAMP)
├── schedule_id (BIGINT, FK) - Horario de la empresa
├── user_id (BIGINT, FK) - Usuario asignado
└── day_of_week (ENUM, NULLABLE) - MONDAY, TUESDAY, etc.
```

**Uso:**
- Define QUÉ usuarios usan QUÉ horarios
- Ejemplo: "Juan usa el horario de 07:00 los Lunes, Miércoles y Viernes"
- Si `day_of_week` es NULL, aplica a todos los días

**Relaciones:**
- `N → 1` con `company_schedules` (muchos usuarios por horario)
- `N → 1` con `users` (un usuario puede tener múltiples horarios)

---

### 9. **attendances**
**Propósito:** Registro de asistencia de pasajeros en los viajes (quién se subió/bajó).

**Estructura:**
```sql
attendances
├── id (BIGINT, PK)
├── created_at (TIMESTAMP)
├── trip_id (BIGINT, FK) - Viaje
├── user_id (BIGINT, FK) - Pasajero
├── boarded (BOOLEAN) - Si se subió o no
├── boarded_at (TIMESTAMP, NULLABLE) - Cuándo se subió
├── boarded_latitude (DOUBLE, NULLABLE) - Dónde se subió (GPS)
├── boarded_longitude (DOUBLE, NULLABLE)
├── dropped_at (TIMESTAMP, NULLABLE) - Cuándo se bajó
├── dropped_latitude (DOUBLE, NULLABLE) - Dónde se bajó (GPS)
└── dropped_longitude (DOUBLE, NULLABLE)
```

**Uso:**
- Registro completo de asistencia con timestamps y ubicación GPS
- Permite saber:
  - ¿Quién se subió al bus?
  - ¿A qué hora?
  - ¿En qué lugar? (útil si cambia la parada)
- El conductor puede escanear QR codes para marcar asistencia

**Relaciones:**
- `N → 1` con `trips` (muchas asistencias por viaje)
- `N → 1` con `users` (muchas asistencias por usuario)

**Restricción:**
- Índice único en `(trip_id, user_id)` - un pasajero solo puede tener UN registro por viaje

---

## 🔗 Diagrama de Relaciones

```
companies
├── users (1:N)
│   ├── vehicles (1:N as driver)
│   ├── trips (1:N as driver)
│   ├── user_addresses (1:N)
│   ├── user_schedules (1:N)
│   └── attendances (1:N)
├── vehicles (1:N)
│   └── trips (1:N)
├── company_schedules (1:N)
│   ├── trips (1:N)
│   └── user_schedules (1:N)
└── trips (1:N)
    ├── trip_positions (1:N)
    └── attendances (1:N)
```

---

## 🎯 Flujo de Datos Típico

### **1. Setup Inicial:**
```
1. Crear empresa → companies
2. Crear gerente → users (role: MANAGER)
3. Crear vehículos → vehicles
4. Definir horarios → company_schedules
5. Crear conductores → users (role: DRIVER)
6. Asignar conductores a vehículos
```

### **2. Registrar Pasajeros:**
```
1. Crear pasajero → users (role: PASSENGER, con qrCode)
2. Agregar su dirección → user_addresses
3. Asignarlo a un horario → user_schedules
```

### **3. Día del Viaje:**
```
1. Crear viaje → trips (status: PENDING)
2. Conductor inicia viaje → trips.status = IN_PROGRESS, trips.started_at = NOW
3. GPS tracking cada 5-30 seg → trip_positions (múltiples registros)
4. Pasajero se sube → attendances (boarded=true, boarded_at, GPS)
5. Pasajero se baja → attendances (dropped_at, GPS)
6. Viaje termina → trips.status = COMPLETED, trips.completed_at = NOW
```

---

## 🚀 Ejemplos de Queries

### **Obtener la posición actual de un viaje:**
```sql
SELECT latitude, longitude, speed, timestamp
FROM trip_positions
WHERE trip_id = 123
ORDER BY timestamp DESC
LIMIT 1;
```

### **Ver historial completo de un viaje:**
```sql
SELECT latitude, longitude, speed, heading, timestamp
FROM trip_positions
WHERE trip_id = 123
ORDER BY timestamp ASC;
```

### **Listar pasajeros que se subieron a un viaje:**
```sql
SELECT u.name, a.boarded_at, a.boarded_latitude, a.boarded_longitude
FROM attendances a
JOIN users u ON u.id = a.user_id
WHERE a.trip_id = 123 AND a.boarded = true
ORDER BY a.boarded_at;
```

---

**Última actualización:** 2025-10-07
**Versión del esquema:** 2.0 (refactorización completa)
