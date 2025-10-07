-- =====================================================
-- SUBITE Database Schema
-- Sistema de gestión de transporte escolar y corporativo
-- Versión: 2.0
-- Última actualización: 2025-10-07
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('MANAGER', 'DRIVER', 'PASSENGER');

-- User status
CREATE TYPE user_status AS ENUM ('NO_ROUTES', 'ON_ROUTE', 'OUT_OF_SERVICE');

-- Schedule types
CREATE TYPE schedule_type AS ENUM ('ARRIVAL', 'DEPARTURE');

-- Trip status
CREATE TYPE trip_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- Address types
CREATE TYPE address_type AS ENUM ('HOME', 'WORK', 'OTHER');

-- Day of week
CREATE TYPE day_of_week AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- =====================================================
-- TABLES
-- =====================================================

-- -----------------------------------------------------
-- Table: companies
-- Purpose: Empresas que usan el sistema de transporte
-- -----------------------------------------------------
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL UNIQUE
);

COMMENT ON TABLE companies IS 'Empresas que usan el sistema de transporte';
COMMENT ON COLUMN companies.name IS 'Nombre único de la empresa';

-- -----------------------------------------------------
-- Table: users
-- Purpose: Usuarios del sistema (gerentes, conductores, pasajeros)
-- -----------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    name VARCHAR(255) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    email TEXT UNIQUE,
    password_hash TEXT,
    role user_role,
    status user_status NOT NULL DEFAULT 'NO_ROUTES',
    notification_id TEXT UNIQUE,
    company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
    qr_code TEXT UNIQUE,
    photo_url TEXT,

    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

COMMENT ON TABLE users IS 'Usuarios del sistema: gerentes, conductores y pasajeros';
COMMENT ON COLUMN users.role IS 'MANAGER (gerente), DRIVER (conductor), PASSENGER (pasajero)';
COMMENT ON COLUMN users.status IS 'Estado del usuario: NO_ROUTES, ON_ROUTE, OUT_OF_SERVICE';
COMMENT ON COLUMN users.qr_code IS 'Código QR único para check-in rápido';
COMMENT ON COLUMN users.notification_id IS 'Token para notificaciones push';

-- Index for faster queries
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------
-- Table: vehicles
-- Purpose: Vehículos de transporte (buses, vans, etc)
-- -----------------------------------------------------
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    name TEXT,
    driver_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    plate TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
    photo_url TEXT
);

COMMENT ON TABLE vehicles IS 'Vehículos de transporte de las empresas';
COMMENT ON COLUMN vehicles.driver_id IS 'Conductor asignado al vehículo (opcional)';
COMMENT ON COLUMN vehicles.plate IS 'Placa del vehículo';
COMMENT ON COLUMN vehicles.active IS 'Si está activo o fuera de servicio';

-- Indexes
CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX idx_vehicles_active ON vehicles(active);

-- -----------------------------------------------------
-- Table: company_schedules
-- Purpose: Horarios de operación de las empresas
-- -----------------------------------------------------
CREATE TABLE company_schedules (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
    time TEXT NOT NULL,
    schedule_type schedule_type NOT NULL
);

COMMENT ON TABLE company_schedules IS 'Horarios de entrada/salida de las empresas';
COMMENT ON COLUMN company_schedules.time IS 'Hora en formato HH:MM (ejemplo: 07:00)';
COMMENT ON COLUMN company_schedules.schedule_type IS 'ARRIVAL (entrada) o DEPARTURE (salida)';

-- Indexes
CREATE INDEX idx_company_schedules_company_id ON company_schedules(company_id);

-- -----------------------------------------------------
-- Table: trips
-- Purpose: Viajes/rutas diarias
-- -----------------------------------------------------
CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    company_schedule_id BIGINT NOT NULL REFERENCES company_schedules(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    driver_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE SET NULL,
    status trip_status NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

COMMENT ON TABLE trips IS 'Viajes/rutas diarias programadas';
COMMENT ON COLUMN trips.company_id IS 'Campo desnormalizado para queries rápidas';
COMMENT ON COLUMN trips.status IS 'PENDING, IN_PROGRESS, COMPLETED, CANCELLED';
COMMENT ON COLUMN trips.started_at IS 'Timestamp de cuándo inició el viaje';
COMMENT ON COLUMN trips.completed_at IS 'Timestamp de cuándo terminó el viaje';

-- Indexes
CREATE INDEX idx_trips_company_id ON trips(company_id);
CREATE INDEX idx_trips_date ON trips(date);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);

-- -----------------------------------------------------
-- Table: trip_positions
-- Purpose: Tracking GPS en tiempo real
-- -----------------------------------------------------
CREATE TABLE trip_positions (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    accuracy DOUBLE PRECISION,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE trip_positions IS 'Posiciones GPS del vehículo durante el viaje';
COMMENT ON COLUMN trip_positions.speed IS 'Velocidad en km/h';
COMMENT ON COLUMN trip_positions.heading IS 'Dirección en grados (0-360)';
COMMENT ON COLUMN trip_positions.accuracy IS 'Precisión del GPS en metros';

-- Indexes (muy importante para queries de tracking)
CREATE INDEX idx_trip_positions_trip_id ON trip_positions(trip_id);
CREATE INDEX idx_trip_positions_timestamp ON trip_positions(timestamp);
CREATE INDEX idx_trip_positions_trip_timestamp ON trip_positions(trip_id, timestamp);

-- -----------------------------------------------------
-- Table: user_addresses
-- Purpose: Direcciones de los usuarios
-- -----------------------------------------------------
CREATE TABLE user_addresses (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_type address_type,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE user_addresses IS 'Direcciones de casa/trabajo de los usuarios';
COMMENT ON COLUMN user_addresses.address_type IS 'HOME (casa), WORK (trabajo), OTHER (otro)';

-- Indexes
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);

-- -----------------------------------------------------
-- Table: user_schedules
-- Purpose: Asignación de usuarios a horarios
-- -----------------------------------------------------
CREATE TABLE user_schedules (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    schedule_id BIGINT NOT NULL REFERENCES company_schedules(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week day_of_week
);

COMMENT ON TABLE user_schedules IS 'Asigna pasajeros a horarios específicos';
COMMENT ON COLUMN user_schedules.day_of_week IS 'Día de la semana (NULL = todos los días)';

-- Indexes
CREATE INDEX idx_user_schedules_schedule_id ON user_schedules(schedule_id);
CREATE INDEX idx_user_schedules_user_id ON user_schedules(user_id);

-- -----------------------------------------------------
-- Table: attendances
-- Purpose: Registro de asistencia de pasajeros
-- -----------------------------------------------------
CREATE TABLE attendances (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boarded BOOLEAN NOT NULL DEFAULT FALSE,
    boarded_at TIMESTAMP,
    boarded_latitude DOUBLE PRECISION,
    boarded_longitude DOUBLE PRECISION,
    dropped_at TIMESTAMP,
    dropped_latitude DOUBLE PRECISION,
    dropped_longitude DOUBLE PRECISION,

    -- Un pasajero solo puede tener UN registro por viaje
    CONSTRAINT unique_trip_user UNIQUE (trip_id, user_id)
);

COMMENT ON TABLE attendances IS 'Registro de asistencia: quién se subió/bajó y dónde';
COMMENT ON COLUMN attendances.boarded IS 'Si el pasajero se subió al vehículo';
COMMENT ON COLUMN attendances.boarded_at IS 'Timestamp de cuándo se subió';
COMMENT ON COLUMN attendances.boarded_latitude IS 'Ubicación GPS donde se subió';
COMMENT ON COLUMN attendances.dropped_at IS 'Timestamp de cuándo se bajó';

-- Indexes
CREATE INDEX idx_attendances_trip_id ON attendances(trip_id);
CREATE INDEX idx_attendances_user_id ON attendances(user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para user_addresses
CREATE TRIGGER update_user_addresses_updated_at
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS (Útiles para consultas comunes)
-- =====================================================

-- Vista: Trips activos con información completa
CREATE OR REPLACE VIEW active_trips AS
SELECT
    t.id,
    t.date,
    t.status,
    t.started_at,
    c.name AS company_name,
    cs.time AS schedule_time,
    cs.schedule_type,
    d.name AS driver_name,
    d.phone AS driver_phone,
    v.name AS vehicle_name,
    v.plate AS vehicle_plate
FROM trips t
JOIN companies c ON c.id = t.company_id
JOIN company_schedules cs ON cs.id = t.company_schedule_id
LEFT JOIN users d ON d.id = t.driver_id
LEFT JOIN vehicles v ON v.id = t.vehicle_id
WHERE t.status IN ('PENDING', 'IN_PROGRESS')
ORDER BY t.date DESC, cs.time ASC;

COMMENT ON VIEW active_trips IS 'Vista de viajes activos (PENDING e IN_PROGRESS) con toda la información';

-- Vista: Última posición de cada trip activo
CREATE OR REPLACE VIEW trip_current_positions AS
SELECT DISTINCT ON (tp.trip_id)
    tp.trip_id,
    tp.latitude,
    tp.longitude,
    tp.speed,
    tp.heading,
    tp.timestamp,
    t.status,
    v.plate AS vehicle_plate
FROM trip_positions tp
JOIN trips t ON t.id = tp.trip_id
LEFT JOIN vehicles v ON v.id = t.vehicle_id
WHERE t.status = 'IN_PROGRESS'
ORDER BY tp.trip_id, tp.timestamp DESC;

COMMENT ON VIEW trip_current_positions IS 'Última posición GPS de cada viaje en progreso';

-- =====================================================
-- SAMPLE DATA (Opcional - comentado)
-- =====================================================

/*
-- Ejemplo de inserción de datos de prueba:

INSERT INTO companies (name) VALUES
    ('Transporte UNITEC'),
    ('Transporte Grupo Paz');

INSERT INTO users (name, email, password_hash, role, company_id) VALUES
    ('Juan Manager', 'manager@unitec.com', '$2b$12$...', 'MANAGER', 1),
    ('Carlos Driver', 'driver@unitec.com', '$2b$12$...', 'DRIVER', 1),
    ('Ana Passenger', 'passenger@unitec.com', '$2b$12$...', 'PASSENGER', 1);

-- ... etc
*/

-- =====================================================
-- NOTAS DE MANTENIMIENTO
-- =====================================================

-- Para limpiar posiciones GPS antiguas (opcional):
-- DELETE FROM trip_positions WHERE timestamp < NOW() - INTERVAL '30 days';

-- Para obtener estadísticas de uso:
-- SELECT company_id, COUNT(*) FROM trips WHERE date >= CURRENT_DATE - 7 GROUP BY company_id;

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
