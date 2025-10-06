import { Company } from "../models/index.js";
import { logger } from "../../utils/logger.js";

export const seedCompanies = async () => {
  logger.info("Seeding companies...");

  const companies = [
    {
      name: "Transportes Medellín S.A.",
    },
    {
      name: "Rutas del Valle",
    },
    {
      name: "Expreso Bogotá",
    },
    {
      name: "Buses del Caribe",
    },
  ];

  try {
    // Check if companies already exist
    const existingCount = await Company.count();
    if (existingCount > 0) {
      logger.info(`Companies already seeded (${existingCount} companies exist)`);
      return;
    }

    // Create companies
    const createdCompanies = await Company.bulkCreate(companies);

    logger.info(`Successfully seeded ${createdCompanies.length} companies`);
    return createdCompanies;
  } catch (error) {
    logger.error("Error seeding companies", { error });
    throw error;
  }
};