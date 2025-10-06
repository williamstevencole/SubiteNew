import { Vehicle, Company, User } from "../models/index.js";
import { UserRole } from "../../types/auth.js";
import { logger } from "../../utils/logger.js";

export const seedVehicles = async () => {
  logger.info("Seeding vehicles...");

  try {
    // Check if vehicles already exist
    const existingCount = await Vehicle.count();
    if (existingCount > 0) {
      logger.info(`Vehicles already seeded (${existingCount} vehicles exist)`);
      return;
    }

    // Get all companies and drivers
    const companies = await Company.findAll();
    const drivers = await User.findAll({ where: { role: UserRole.DRIVER } });

    if (companies.length === 0) {
      logger.error("No companies found. Please seed companies first.");
      throw new Error("Companies must be seeded before vehicles");
    }

    if (drivers.length === 0) {
      logger.error("No drivers found. Please seed users first.");
      throw new Error("Users must be seeded before vehicles");
    }

    const vehicles = [
      // Transportes Medellín S.A.
      {
        name: "Bus Ejecutivo 001",
        plate: "MEL001",
        active: true,
        companyId: companies[0]!.id,
        driverId: drivers.find(d => d.companyId === companies[0]!.id)?.id,
      },
      {
        name: "Bus Urbano 002",
        plate: "MEL002",
        active: true,
        companyId: companies[0]!.id,
        driverId: drivers.find(d => d.companyId === companies[0]!.id && d.id !== drivers.find(d => d.companyId === companies[0]!.id)?.id)?.id,
      },
      {
        name: "Bus Turístico 003",
        plate: "MEL003",
        active: true,
        companyId: companies[0]!.id,
        driverId: undefined, // Sin asignar
      },

      // Rutas del Valle
      {
        name: "Express Valle 101",
        plate: "VAL101",
        active: true,
        companyId: companies[1]!.id,
        driverId: drivers.find(d => d.companyId === companies[1]!.id)?.id,
      },
      {
        name: "Intermunicipal 102",
        plate: "VAL102",
        active: true,
        companyId: companies[1]!.id,
        driverId: undefined,
      },

      // Expreso Bogotá
      {
        name: "TransMilenio 201",
        plate: "BOG201",
        active: true,
        companyId: companies[2]!.id,
        driverId: drivers.find(d => d.companyId === companies[2]!.id)?.id,
      },
      {
        name: "Bus Alimentador 202",
        plate: "BOG202",
        active: false, // En mantenimiento
        companyId: companies[2]!.id,
        driverId: undefined,
      },

      // Buses del Caribe (sin conductores asignados aún)
      {
        name: "Caribe Express 301",
        plate: "CAR301",
        active: true,
        companyId: companies[3]!.id,
        driverId: undefined,
      },
      {
        name: "Costa Atlántica 302",
        plate: "CAR302",
        active: true,
        companyId: companies[3]!.id,
        driverId: undefined,
      },
    ];

    // Create vehicles
    const createdVehicles = await Vehicle.bulkCreate(vehicles);

    logger.info(`Successfully seeded ${createdVehicles.length} vehicles`);
    return createdVehicles;
  } catch (error) {
    logger.error("Error seeding vehicles", { error });
    throw error;
  }
};