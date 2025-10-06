# SUBITE Backend API - Ejemplos de Uso

## 🔐 Autenticación

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@medellin.com",
    "password": "password123"
  }'
```

### Registro
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@ejemplo.com",
    "name": "Usuario Nuevo",
    "phone": "+57 300 000 0000",
    "role": "PASSENGER"
  }'
```

### Obtener información del usuario actual
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 Usuarios Disponibles

**Managers:**
- Email: `manager@medellin.com` | Password: `password123`
- Email: `manager@valle.com` | Password: `password123`
- Email: `manager@bogota.com` | Password: `password123`
- Email: `admin@subite.com` | Password: `password123` (Admin sin empresa)

**Drivers:**
- Email: `driver1@medellin.com` | Password: `password123`
- Email: `driver2@medellin.com` | Password: `password123`
- Email: `driver1@valle.com` | Password: `password123`
- Email: `driver1@bogota.com` | Password: `password123`

**Passengers:**
- Email: `passenger1@example.com` | Password: `password123`
- Email: `passenger2@example.com` | Password: `password123`
- Email: `passenger3@example.com` | Password: `password123`
- Email: `passenger4@example.com` | Password: `password123`

## 🏢 Empresas

### Obtener empresa (Manager solamente)
```bash
curl -X GET http://localhost:4000/api/companies/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Obtener vehículos de la empresa
```bash
curl -X GET http://localhost:4000/api/companies/1/vehicles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚌 Vehículos

### Obtener detalles de un vehículo
```bash
curl -X GET http://localhost:4000/api/vehicles/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Crear vehículo (Manager solamente)
```bash
curl -X POST http://localhost:4000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Bus Nuevo 001",
    "plate": "ABC123",
    "driverId": 4
  }'
```

## 🗓️ Rutas Diarias

### Obtener rutas diarias
```bash
curl -X GET http://localhost:4000/api/daily-routes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Obtener ruta específica
```bash
curl -X GET http://localhost:4000/api/daily-routes/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Crear ruta diaria (Manager solamente)
```bash
curl -X POST http://localhost:4000/api/daily-routes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2025-10-07T08:00:00.000Z",
    "vehicleId": 1,
    "driverId": 4
  }'
```

### Actualizar ruta diaria (Manager o Driver asignado)
```bash
curl -X PUT http://localhost:4000/api/daily-routes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "IN_PROGRESS",
    "lastLat": 6.2442,
    "lastLng": -75.5812
  }'
```

## 🏥 Health Check

```bash
curl -X GET http://localhost:4000/api/health
```

## 📊 Datos de Prueba

### Empresas creadas:
1. Transportes Medellín S.A.
2. Rutas del Valle
3. Expreso Bogotá
4. Buses del Caribe

### Vehículos por empresa:
- **Medellín**: MEL001, MEL002, MEL003
- **Valle**: VAL101, VAL102
- **Bogotá**: BOG201, BOG202
- **Caribe**: CAR301, CAR302

### Estados de rutas:
- **PENDING**: Pendiente de iniciar
- **IN_PROGRESS**: En progreso
- **FINISHED**: Completada
- **CANCELLED**: Cancelada