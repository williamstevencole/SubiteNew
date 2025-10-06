import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || "INTERNAL_ERROR";
  const message = error.message || "Internal server error";

  logger.error("Request error", {
    error: {
      message: error.message,
      stack: error.stack,
      code: errorCode,
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    },
    user: req.auth?.userId,
  });

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message,
    },
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn("Route not found", {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.url} not found`,
    },
  });
};