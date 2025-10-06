import { connectDB, sequelize } from "../index.js";
import { logger } from "../../utils/logger.js";
import { seedCompanies } from "./01-companies.js";
import { seedUsers } from "./02-users.js";
import { seedVehicles } from "./03-vehicles.js";
import { seedDailyRoutes } from "./04-dailyRoutes.js";

export const runSeeds = async (forceLog = false) => {
  try {
    // Run seeds in order
    await seedCompanies();
    await seedUsers();
    await seedVehicles();
    await seedDailyRoutes();

    if (forceLog) {
      logger.info("✅ Database seeding completed successfully!");
      logger.info("");
      logger.info("🔐 Login credentials:");
      logger.info("  Email: manager@medellin.com | Password: password123 (Manager)");
      logger.info("  Email: driver1@medellin.com | Password: password123 (Driver)");
      logger.info("  Email: passenger1@example.com | Password: password123 (Passenger)");
      logger.info("  Email: admin@subite.com | Password: password123 (Admin)");
      logger.info("");
    }3

  } catch (error) {
    logger.error("❌ Error during database seeding", { error });
    throw error;
  }
};

// Run seeds if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    logger.info("Starting database seeding...");

    try {
      // Connect to database
      const connected = await connectDB();
      if (!connected) {
        throw new Error("Could not connect to database");
      }

      // Sync database schema
      await sequelize.sync({ force: false });
      logger.info("Database schema synchronized");

      await runSeeds(true); // forceLog = true when run directly

      logger.info("Seeding script completed");
      process.exit(0);
    } catch (error) {
      logger.error("Seeding script failed", { error });
      process.exit(1);
    }
  })();
}
