import { Sequelize } from "sequelize";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: env.NODE_ENV === "development" ? (sql) => logger.debug(sql) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

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
