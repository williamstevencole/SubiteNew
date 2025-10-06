import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { JWTPayload, AuthUser, UserRole } from "../types/auth.js";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Access token required",
      },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;

    req.auth = {
      userId: parseInt(decoded.sub),
      role: decoded.role,
      companyId: decoded.companyId ? parseInt(decoded.companyId) : null,
      email: decoded.email,
    };

    logger.debug("User authenticated", {
      userId: req.auth.userId,
      role: req.auth.role,
      companyId: req.auth.companyId,
    });

    next();
  } catch (error) {
    logger.warn("Invalid token", { error: error instanceof Error ? error.message : "Unknown error" });
    res.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "Invalid or expired token",
      },
    });
  }
};