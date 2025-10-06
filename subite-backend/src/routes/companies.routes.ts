import { Router } from "express";
import { z } from "zod";
import {
  getCompany,
  getCompanyVehicles,
  createCompany,
  updateCompany,
} from "../controllers/companies.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireManager, requireSameCompany } from "../middleware/rbac.js";
import { validateBody, validateQuery, validateParams } from "../middleware/validation.js";

const router = Router();

// Validation schemas
const createCompanySchema = z.object({
  name: z.string().min(1),
});

const updateCompanySchema = z.object({
  name: z.string().min(1),
});

const getVehiclesQuerySchema = z.object({
  limit: z.coerce.number().default(20),
  cursor: z.coerce.number().optional(),
  active: z.coerce.boolean().optional(),
});

const companyParamsSchema = z.object({
  id: z.string().transform(Number),
});

// Routes
router.post(
  "/",
  authenticateToken,
  requireManager,
  validateBody(createCompanySchema),
  createCompany
);

router.get(
  "/:id",
  authenticateToken,
  requireManager,
  validateParams(companyParamsSchema),
  getCompany
);

router.put(
  "/:id",
  authenticateToken,
  requireManager,
  validateParams(companyParamsSchema),
  validateBody(updateCompanySchema),
  updateCompany
);

router.get(
  "/:id/vehicles",
  authenticateToken,
  requireSameCompany(),
  validateParams(companyParamsSchema),
  validateQuery(getVehiclesQuerySchema),
  getCompanyVehicles
);

export default router;