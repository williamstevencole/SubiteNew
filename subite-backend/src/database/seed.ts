import {
  User,
  Company,
  Vehicle,
  Trip,
  CompanySchedule,
  UserSchedule,
  UserAddress,
  TripPosition,
  Attendance,
  sequelize
} from './database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

export const runSeeds = async () => {
  try {
    logger.info("Starting database seeding...");

    // Check if data already exists
    const companyCount = await Company.count();
    if (companyCount > 0) {
      logger.info("Database already seeded, skipping...");
      return;
    }

    const companies = await Company.bulkCreate([
      { name: "Transporte UNITEC" },
      { name: "Transporte Grupo Paz" },
      { name: "Turismo Express" }
    ]);

    logger.info(`Created ${companies.length} companies`);

    // Hash the default password for all users
    const defaultPasswordHash = await bcrypt.hash("password123", 12);

    // 2. Create Users (with QR codes and photos)
    const users = await User.bulkCreate([
      // Managers
      {
        name: "Juan Pérez",
        email: "manager1@gmail.com",
        passwordHash: defaultPasswordHash,
        phone: "+57 300 1234567",
        role: "MANAGER",
        status: "NO_ROUTES",
        companyId: companies[0]!.get('id') as number,
        qrCode: `QR-MANAGER1-${Date.now()}`,
        photoUrl: null
      },
      {
        name: "María González",
        email: "manager2@gmail.com",
        passwordHash: defaultPasswordHash,
        phone: "+57 301 2345678",
        role: "MANAGER",
        status: "NO_ROUTES",
        companyId: companies[1]!.get('id') as number,
        qrCode: `QR-MANAGER2-${Date.now()}`,
        photoUrl: null
      },
      // Drivers
      {
        name: "Carlos Rodríguez",
        email: "driver1@gmail.com",
        passwordHash: defaultPasswordHash,
        phone: "+57 302 3456789",
        role: "DRIVER",
        status: "NO_ROUTES",
        companyId: companies[0]!.get('id') as number,
        qrCode: `QR-DRIVER1-${Date.now()}`,
        photoUrl: null
      },
      {
        name: "Pedro Martínez",
        email: "driver2@gmail.com",
        passwordHash: defaultPasswordHash,
        phone: "+57 303 4567890",
        role: "DRIVER",
        status: "NO_ROUTES",
        companyId: companies[0]!.get('id') as number,
        qrCode: `QR-DRIVER2-${Date.now()}`,
        photoUrl: null
      },
      // Passengers
      {
        name: "Ana López",
        email: "passenger1@gmail.com",
        passwordHash: defaultPasswordHash,
        phone: "+57 304 5678901",
        role: "PASSENGER",
        status: "NO_ROUTES",
        companyId: companies[0]!.get('id') as number,
        qrCode: `QR-PASS1-${Date.now()}`,
        photoUrl: null
      },
      {
        name: "Luis Hernández",
        email: "passenger2@gmail.com",
        passwordHash: defaultPasswordHash,
        phone: "+57 305 6789012",
        role: "PASSENGER",
        status: "NO_ROUTES",
        companyId: companies[0]!.get('id') as number,
        qrCode: `QR-PASS2-${Date.now()}`,
        photoUrl: null
      }
    ]);

    logger.info(`Created ${users.length} users`);

    // 3. Create Vehicles
    const vehicles = await Vehicle.bulkCreate([
      {
        name: "Bus UNITEC-001",
        plate: "ABC-123",
        driverId: users.find(u => u.get('email') === 'driver1@gmail.com')?.get('id') as number,
        active: true,
        companyId: companies[0]!.get('id') as number,
        maxCapacity: 40,
        photoUrl: null
      },
      {
        name: "Bus UNITEC-002",
        plate: "XYZ-789",
        driverId: users.find(u => u.get('email') === 'driver2@gmail.com')?.get('id') as number,
        active: true,
        companyId: companies[0]!.get('id') as number,
        maxCapacity: 35,
        photoUrl: null
      },
      {
        name: "Van Grupo Paz-001",
        plate: "DEF-456",
        driverId: null,
        active: true,
        companyId: companies[1]!.get('id') as number,
        maxCapacity: 20,
        photoUrl: null
      }
    ]);

    logger.info(`Created ${vehicles.length} vehicles`);

    // 4. Create Company Schedules
    const companySchedules = await CompanySchedule.bulkCreate([
      // UNITEC schedules
      {
        companyId: companies[0]!.get('id') as number,
        time: "07:00",
        scheduleType: "DEPARTURE"
      },
      {
        companyId: companies[0]!.get('id') as number,
        time: "17:30",
        scheduleType: "DEPARTURE"
      },
      {
        companyId: companies[0]!.get('id') as number,
        time: "08:00",
        scheduleType: "ARRIVAL"
      },
      {
        companyId: companies[0]!.get('id') as number,
        time: "18:30",
        scheduleType: "ARRIVAL"
      },
      // Grupo Paz schedules
      {
        companyId: companies[1]!.get('id') as number,
        time: "06:30",
        scheduleType: "DEPARTURE"
      },
      {
        companyId: companies[1]!.get('id') as number,
        time: "07:30",
        scheduleType: "ARRIVAL"
      }
    ]);

    logger.info(`Created ${companySchedules.length} company schedules`);

    // 5. Create User Addresses
    const userAddresses = await UserAddress.bulkCreate([
      // Ana López addresses
      {
        userId: users.find(u => u.get('email') === 'passenger1@gmail.com')?.get('id') as number,
        addressType: "HOME",
        address: "Calle 123 #45-67, Tegucigalpa",
        latitude: 14.0818,
        longitude: -87.2068
      },
      {
        userId: users.find(u => u.get('email') === 'passenger1@gmail.com')?.get('id') as number,
        addressType: "WORK",
        address: "UNITEC Campus, Tegucigalpa",
        latitude: 14.0723,
        longitude: -87.1921
      },
      // Luis Hernández addresses
      {
        userId: users.find(u => u.get('email') === 'passenger2@gmail.com')?.get('id') as number,
        addressType: "HOME",
        address: "Colonia Palmira, Tegucigalpa",
        latitude: 14.0901,
        longitude: -87.2012
      },
      {
        userId: users.find(u => u.get('email') === 'passenger2@gmail.com')?.get('id') as number,
        addressType: "WORK",
        address: "UNITEC Campus, Tegucigalpa",
        latitude: 14.0723,
        longitude: -87.1921
      }
    ]);

    logger.info(`Created ${userAddresses.length} user addresses`);

    // 6. Create User Schedules (passenger schedule assignments)
    const userSchedules = await UserSchedule.bulkCreate([
      // Ana López - morning departure
      {
        scheduleId: companySchedules.find(s => s.get('time') === '07:00' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        userId: users.find(u => u.get('email') === 'passenger1@gmail.com')?.get('id') as number,
        dayOfWeek: "MONDAY"
      },
      {
        scheduleId: companySchedules.find(s => s.get('time') === '07:00' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        userId: users.find(u => u.get('email') === 'passenger1@gmail.com')?.get('id') as number,
        dayOfWeek: "TUESDAY"
      },
      {
        scheduleId: companySchedules.find(s => s.get('time') === '07:00' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        userId: users.find(u => u.get('email') === 'passenger1@gmail.com')?.get('id') as number,
        dayOfWeek: "WEDNESDAY"
      },
      // Luis Hernández - evening departure
      {
        scheduleId: companySchedules.find(s => s.get('time') === '17:30' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        userId: users.find(u => u.get('email') === 'passenger2@gmail.com')?.get('id') as number,
        dayOfWeek: "MONDAY"
      },
      {
        scheduleId: companySchedules.find(s => s.get('time') === '17:30' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        userId: users.find(u => u.get('email') === 'passenger2@gmail.com')?.get('id') as number,
        dayOfWeek: "FRIDAY"
      }
    ]);

    logger.info(`Created ${userSchedules.length} user schedules`);

    // 7. Create some sample trips for today and recent dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const trips = await Trip.bulkCreate([
      // Today's morning trip
      {
        companyScheduleId: companySchedules.find(s => s.get('time') === '07:00' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        companyId: companies[0]!.get('id') as number,
        date: today.toISOString().split('T')[0],
        driverId: users.find(u => u.get('email') === 'driver1@gmail.com')?.get('id') as number,
        vehicleId: vehicles[0]!.get('id') as number,
        status: "PENDING"
      },
      // Today's evening trip
      {
        companyScheduleId: companySchedules.find(s => s.get('time') === '17:30' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        companyId: companies[0]!.get('id') as number,
        date: today.toISOString().split('T')[0],
        driverId: users.find(u => u.get('email') === 'driver2@gmail.com')?.get('id') as number,
        vehicleId: vehicles[1]!.get('id') as number,
        status: "PENDING"
      },
      // Yesterday's completed trip
      {
        companyScheduleId: companySchedules.find(s => s.get('time') === '07:00' && s.get('scheduleType') === 'DEPARTURE')?.get('id') as number,
        companyId: companies[0]!.get('id') as number,
        date: yesterday.toISOString().split('T')[0],
        driverId: users.find(u => u.get('email') === 'driver1@gmail.com')?.get('id') as number,
        vehicleId: vehicles[0]!.get('id') as number,
        status: "COMPLETED",
        startedAt: new Date(yesterday.getTime() + 7 * 60 * 60 * 1000), // 7:00 AM yesterday
        completedAt: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000) // 8:00 AM yesterday
      }
    ]);

    logger.info(`Created ${trips.length} trips`);

    // 8. Create Trip Positions for the completed trip
    const completedTrip = trips.find(t => t.get('status') === 'COMPLETED');
    if (completedTrip) {
      const tripPositions = await TripPosition.bulkCreate([
        {
          tripId: completedTrip.get('id') as number,
          latitude: 14.0818,
          longitude: -87.2068,
          speed: 0,
          heading: 45,
          accuracy: 5,
          timestamp: new Date(yesterday.getTime() + 7 * 60 * 60 * 1000) // Start position
        },
        {
          tripId: completedTrip.get('id') as number,
          latitude: 14.0801,
          longitude: -87.2050,
          speed: 25,
          heading: 90,
          accuracy: 3,
          timestamp: new Date(yesterday.getTime() + 7 * 60 * 60 * 1000 + 10 * 60 * 1000) // 10 min later
        },
        {
          tripId: completedTrip.get('id') as number,
          latitude: 14.0785,
          longitude: -87.2010,
          speed: 30,
          heading: 135,
          accuracy: 4,
          timestamp: new Date(yesterday.getTime() + 7 * 60 * 60 * 1000 + 20 * 60 * 1000) // 20 min later
        },
        {
          tripId: completedTrip.get('id') as number,
          latitude: 14.0723,
          longitude: -87.1921,
          speed: 0,
          heading: 180,
          accuracy: 2,
          timestamp: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000) // End position
        }
      ]);

      logger.info(`Created ${tripPositions.length} trip positions`);
    }

    // 9. Create Attendance records for trips
    const attendances = await Attendance.bulkCreate([
      // Ana López attended yesterday's trip
      {
        tripId: completedTrip?.get('id') as number,
        userId: users.find(u => u.get('email') === 'passenger1@gmail.com')?.get('id') as number,
        boarded: true,
        boardedAt: new Date(yesterday.getTime() + 7 * 60 * 60 * 1000 + 5 * 60 * 1000), // 7:05 AM
        boardedLatitude: 14.0818,
        boardedLongitude: -87.2068,
        droppedAt: new Date(yesterday.getTime() + 7 * 60 * 60 * 1000 + 55 * 60 * 1000), // 7:55 AM
        droppedLatitude: 14.0723,
        droppedLongitude: -87.1921
      },
      // Luis Hernández registered for today's evening trip (not boarded yet)
      {
        tripId: trips.find(t => t.get('status') === 'PENDING' &&
                            companySchedules.find(s => s.get('id') === t.get('companyScheduleId') && s.get('time') === '17:30')
                           )?.get('id') as number,
        userId: users.find(u => u.get('email') === 'passenger2@gmail.com')?.get('id') as number,
        boarded: false,
        boardedAt: null,
        boardedLatitude: null,
        boardedLongitude: null,
        droppedAt: null,
        droppedLatitude: null,
        droppedLongitude: null
      }
    ]);

    logger.info(`Created ${attendances.length} attendance records`);

    logger.info("Database seeding completed successfully!");
    logger.info("Sample login credentials:");
    logger.info("- Manager: manager1@gmail.com / password123");
    logger.info("- Driver: driver1@gmail.com / password123");
    logger.info("- Passenger: passenger1@gmail.com / password123");


  } catch (error) {
    logger.error("Error seeding database:", error);
    throw error;
  }
};
