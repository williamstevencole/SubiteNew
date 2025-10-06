import { User, Company } from "../models/index.js";
import { UserRole } from "../../types/auth.js";
import { logger } from "../../utils/logger.js";

export const seedUsers = async () => {
  logger.info("Seeding users...");

  try {
    // Check if users already exist
    const existingCount = await User.count();
    if (existingCount > 0) {
      logger.info(`Users already seeded (${existingCount} users exist)`);
      return;
    }

    // Get all companies
    const companies = await Company.findAll();
    if (companies.length === 0) {
      logger.error("No companies found. Please seed companies first.");
      throw new Error("Companies must be seeded before users");
    }

    const users = [
      // Managers for each company
      {
        email: "manager@medellin.com",
        name: "Carlos Rodríguez",
        phone: "+57 300 123 4567",
        role: UserRole.MANAGER,
        companyId: companies[0]!.id,
      },
      {
        email: "manager@valle.com",
        name: "María González",
        phone: "+57 310 234 5678",
        role: UserRole.MANAGER,
        companyId: companies[1]!.id,
      },
      {
        email: "manager@bogota.com",
        name: "Luis Martínez",
        phone: "+57 320 345 6789",
        role: UserRole.MANAGER,
        companyId: companies[2]!.id,
      },

      // Drivers
      {
        email: "driver1@medellin.com",
        name: "Andrés Pérez",
        phone: "+57 301 111 2222",
        role: UserRole.DRIVER,
        companyId: companies[0]!.id,
      },
      {
        email: "driver2@medellin.com",
        name: "Jorge Sánchez",
        phone: "+57 302 333 4444",
        role: UserRole.DRIVER,
        companyId: companies[0]!.id,
      },
      {
        email: "driver1@valle.com",
        name: "Ana Ramírez",
        phone: "+57 311 555 6666",
        role: UserRole.DRIVER,
        companyId: companies[1]!.id,
      },
      {
        email: "driver1@bogota.com",
        name: "Pedro Torres",
        phone: "+57 321 777 8888",
        role: UserRole.DRIVER,
        companyId: companies[2]!.id,
      },

      // Passengers
      {
        email: "passenger1@example.com",
        name: "Laura Jiménez",
        phone: "+57 305 111 1111",
        role: UserRole.PASSENGER,
        companyId: companies[0]!.id,
      },
      {
        email: "passenger2@example.com",
        name: "Diego Vargas",
        phone: "+57 315 222 2222",
        role: UserRole.PASSENGER,
        companyId: companies[1]!.id,
      },
      {
        email: "passenger3@example.com",
        name: "Sofia Castro",
        phone: "+57 325 333 3333",
        role: UserRole.PASSENGER,
        companyId: companies[2]!.id,
      },
      {
        email: "passenger4@example.com",
        name: "Miguel Herrera",
        phone: "+57 306 444 4444",
        role: UserRole.PASSENGER,
        companyId: companies[0]!.id,
      },

      // Admin user (super manager)
      {
        email: "admin@subite.com",
        name: "Administrador Sistema",
        phone: "+57 300 000 0000",
        role: UserRole.MANAGER,
        companyId: undefined, // No company = can see all
      },
    ];

    // Create users
    const createdUsers = await User.bulkCreate(users);

    logger.info(`Successfully seeded ${createdUsers.length} users`);
    logger.info("Default login credentials: email + password 'password123'");

    return createdUsers;
  } catch (error) {
    logger.error("Error seeding users", { error });
    throw error;
  }
};