import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === "production" ? false : "*", // Configure properly for production
  credentials: true,
}));

// Logging middleware
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim(), { source: "http" }),
  },
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy if behind reverse proxy
app.set("trust proxy", 1);

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    service: "SUBITE Backend API",
    version: "1.0.0",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
