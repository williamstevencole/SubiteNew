import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { connectDB, syncDB } from "./database/database.js";
import { runSeeds } from "./database/seed.js";

const startServer = async () => {
  try {
    logger.info("Connecting to database...");
    const connected = await connectDB();

    if (connected) {
      logger.info("Database connected successfully");

      logger.info("Synchronizing database schema...");
      await syncDB(false);
      logger.info("Database synchronized successfully");

      logger.info("Running database seeds...");
      await runSeeds();
    } else {
      logger.warn("Database connection failed, continuing without DB");
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`, {
        environment: env.NODE_ENV,
        port: env.PORT,
        timestamp: new Date().toISOString(),
      });
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          const { sequelize } = await import("./database/database.js");
          await sequelize.close();
          logger.info("Database disconnected");
          process.exit(0);
        } catch (error) {
          logger.error("Error during database disconnect", { error });
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack
      });
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection", {
        reason,
        promise: promise.toString()
      });
      process.exit(1);
    });

  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

// Start the server
startServer();
