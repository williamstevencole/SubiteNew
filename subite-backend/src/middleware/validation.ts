import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { logger } from "../utils/logger.js";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn("Validation error", {
          endpoint: req.path,
          errors: error.issues,
        });

        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: error.issues,
          },
        });
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedQuery = schema.parse(req.query);
      req.query = parsedQuery as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn("Query validation error", {
          endpoint: req.path,
          errors: error.issues,
        });

        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid query parameters",
            details: error.issues,
          },
        });
      } else {
        next(error);
      }
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedParams = schema.parse(req.params);
      req.params = parsedParams as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn("Params validation error", {
          endpoint: req.path,
          errors: error.issues,
        });

        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid route parameters",
            details: error.issues,
          },
        });
      } else {
        next(error);
      }
    }
  };
};