import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

export const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: isDev ? (sql) => logger.debug(sql) : false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  define: { timestamps: false },
});

/* =========================
   MODELS
   ========================= */

// Company
export const Company = sequelize.define('companies', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  tableName: 'companies',
  timestamps: false
});

// User
export const User = sequelize.define('users', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
    validate: { isEmail: true }
  },
  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'password_hash'
  },
  role: {
    type: DataTypes.ENUM('MANAGER', 'DRIVER', 'PASSENGER'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('NO_ROUTES', 'ON_ROUTE', 'OUT_OF_SERVICE'),
    allowNull: false,
    defaultValue: 'NO_ROUTES'
  },
  notificationId: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
    field: 'notification_id'
  },
  companyId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: { model: 'companies', key: 'id' },
    onDelete: 'SET NULL',
    field: 'company_id'
  },
  // NEW: QR Code and Photo directly in User
  qrCode: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
    field: 'qr_code'
  },
  photoUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'photo_url'
  }
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user: any) => {
      if (user.passwordHash) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        user.passwordHash = await bcrypt.hash(user.passwordHash, rounds);
      }
    },
    beforeUpdate: async (user: any) => {
      if (user.changed('passwordHash')) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        user.passwordHash = await bcrypt.hash(user.passwordHash, rounds);
      }
    },
  },
});

// Vehicle
export const Vehicle = sequelize.define('vehicles', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  driverId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'SET NULL',
    field: 'driver_id'
  },
  plate: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'companies', key: 'id' },
    onDelete: 'CASCADE',
    field: 'company_id'
  },
  maxCapacity: {
  type: DataTypes.INTEGER,
    allowNull: false,
    field: 'max_capacity'
  },
  photoUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'photo_url'
  }
}, {
  tableName: 'vehicles',
  timestamps: false
});

// Company Schedule
export const CompanySchedule = sequelize.define('company_schedules', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  companyId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: { model: 'companies', key: 'id' },
    onDelete: 'CASCADE',
    field: 'company_id'
  },
  time: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  scheduleType: {
    type: DataTypes.ENUM('ARRIVAL', 'DEPARTURE'),
    allowNull: false,
    field: 'schedule_type'
  }
}, {
  tableName: 'company_schedules',
  timestamps: false
});

// Trip (formerly DailyRoute)
export const Trip = sequelize.define('trips', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  companyScheduleId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'company_schedules', key: 'id' },
    onDelete: 'CASCADE',
    field: 'company_schedule_id'
  },
  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'companies', key: 'id' },
    onDelete: 'CASCADE',
    field: 'company_id'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  driverId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'SET NULL',
    field: 'driver_id'
  },
  vehicleId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'vehicles', key: 'id' },
    onDelete: 'SET NULL',
    field: 'vehicle_id'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'started_at'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  }
}, {
  tableName: 'trips',
  timestamps: false
});

// Trip Position (GPS Tracking)
export const TripPosition = sequelize.define('trip_positions', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  tripId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'trips', key: 'id' },
    onDelete: 'CASCADE',
    field: 'trip_id'
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  speed: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    comment: 'Speed in km/h'
  },
  heading: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    comment: 'Direction in degrees (0-360)'
  },
  accuracy: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    comment: 'GPS accuracy in meters'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'trip_positions',
  timestamps: false,
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['timestamp'] },
    { fields: ['trip_id', 'timestamp'] }
  ]
});

// User Address
export const UserAddress = sequelize.define('user_addresses', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    field: 'user_id'
  },
  addressType: {
    type: DataTypes.ENUM('HOME', 'WORK', 'OTHER'),
    allowNull: true,
    field: 'address_type'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'user_addresses',
  timestamps: false
});

// User Schedule
export const UserSchedule = sequelize.define('user_schedules', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  scheduleId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'company_schedules', key: 'id' },
    onDelete: 'CASCADE',
    field: 'schedule_id'
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    field: 'user_id'
  },
  dayOfWeek: {
    type: DataTypes.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
    allowNull: true,
    field: 'day_of_week'
  }
}, {
  tableName: 'user_schedules',
  timestamps: false
});

// Attendance (formerly RouteAttendance)
export const Attendance = sequelize.define('attendances', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  tripId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'trips', key: 'id' },
    onDelete: 'CASCADE',
    field: 'trip_id'
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    field: 'user_id'
  },
  boarded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  boardedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'boarded_at'
  },
  boardedLatitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'boarded_latitude'
  },
  boardedLongitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'boarded_longitude'
  },
  droppedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'dropped_at'
  },
  droppedLatitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'dropped_latitude'
  },
  droppedLongitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'dropped_longitude'
  }
}, {
  tableName: 'attendances',
  timestamps: false,
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['user_id'] },
    { fields: ['trip_id', 'user_id'], unique: true }
  ]
});

/* =========================
   RELATIONSHIPS
   ========================= */

// Company ↔ Users
Company.hasMany(User, { foreignKey: 'companyId', as: 'users' });
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Company ↔ Schedules
Company.hasMany(CompanySchedule, { foreignKey: 'companyId', as: 'schedules' });
CompanySchedule.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Company ↔ Vehicles
Company.hasMany(Vehicle, { foreignKey: 'companyId', as: 'vehicles' });
Vehicle.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Company ↔ Trips
Company.hasMany(Trip, { foreignKey: 'companyId', as: 'trips' });
Trip.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// User ↔ Vehicles (as driver)
User.hasMany(Vehicle, { foreignKey: 'driverId', as: 'vehiclesDriven' });
Vehicle.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// User ↔ Trips (as driver)
User.hasMany(Trip, { foreignKey: 'driverId', as: 'tripsDriven' });
Trip.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// Vehicle ↔ Trips
Vehicle.hasMany(Trip, { foreignKey: 'vehicleId', as: 'trips' });
Trip.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

// Company Schedule ↔ Trips
CompanySchedule.hasMany(Trip, { foreignKey: 'companyScheduleId', as: 'trips' });
Trip.belongsTo(CompanySchedule, { foreignKey: 'companyScheduleId', as: 'companySchedule' });

// Trip ↔ Trip Positions
Trip.hasMany(TripPosition, { foreignKey: 'tripId', as: 'positions' });
TripPosition.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// User ↔ Addresses
User.hasMany(UserAddress, { foreignKey: 'userId', as: 'addresses' });
UserAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User ↔ Schedules
User.hasMany(UserSchedule, { foreignKey: 'userId', as: 'userSchedules' });
UserSchedule.belongsTo(User, { foreignKey: 'userId', as: 'user' });

CompanySchedule.hasMany(UserSchedule, { foreignKey: 'scheduleId', as: 'assignedUsers' });
UserSchedule.belongsTo(CompanySchedule, { foreignKey: 'scheduleId', as: 'schedule' });

// Trips ↔ Attendances
Trip.hasMany(Attendance, { foreignKey: 'tripId', as: 'attendances' });
Attendance.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

User.hasMany(Attendance, { foreignKey: 'userId', as: 'attendances' });
Attendance.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/* =========================
   BACKWARD COMPATIBILITY ALIASES
   ========================= */

// Keep old names for backward compatibility with controllers
export const DailyRoute = Trip;
export const RouteAttendance = Attendance;

/* =========================
   CONNECTION FUNCTIONS
   ========================= */

export const connectDB = async (maxRetries = 10, retryDelay = 2000): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      logger.info("Database connection established successfully");
      return true;
    } catch (error) {
      logger.warn(`Database connection attempt ${attempt}/${maxRetries} failed`, { error });

      if (attempt === maxRetries) {
        logger.error("Unable to connect to the database after all retries", { error });
        return false;
      }

      logger.info(`Retrying database connection in ${retryDelay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  return false;
};

export const syncDB = async (force = false): Promise<boolean> => {
  try {
    await sequelize.sync({ force });
    logger.info("Database synchronized successfully");
    return true;
  } catch (error) {
    logger.error("Unable to sync database", { error });
    return false;
  }
};
