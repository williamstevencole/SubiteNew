import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/auth.js";
import { logger } from "../utils/logger.js";

export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
      return;
    }

    if (!roles.includes(req.auth.role)) {
      logger.warn("Insufficient role permissions", {
        userId: req.auth.userId,
        userRole: req.auth.role,
        requiredRoles: roles,
        endpoint: req.path,
      });

      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: `Insufficient permissions. Required roles: ${roles.join(", ")}`,
        },
      });
      return;
    }

    next();
  };
};

export const requireSameCompany = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
      return;
    }

    if (!req.auth.companyId) {
      logger.warn("User has no company assignment", {
        userId: req.auth.userId,
        endpoint: req.path,
      });

      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "User must be assigned to a company",
        },
      });
      return;
    }

    next();
  };
};

// Convenience middleware for specific roles
export const requireManager = requireRole(UserRole.MANAGER);
export const requireDriver = requireRole(UserRole.DRIVER);
export const requirePassenger = requireRole(UserRole.PASSENGER);
export const requireManagerOrDriver = requireRole([UserRole.MANAGER, UserRole.DRIVER]);