import { Router } from "express";
import { z } from "zod";
import {
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicles.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireManager } from "../middleware/rbac.js";
import { validateBody, validateParams } from "../middleware/validation.js";

const router = Router();

// Validation schemas
const createVehicleSchema = z.object({
  name: z.string().optional(),
  plate: z.string().optional(),
  driverId: z.number().optional(),
});

const updateVehicleSchema = z.object({
  name: z.string().optional(),
  plate: z.string().optional(),
  driverId: z.number().optional(),
  active: z.boolean().optional(),
});

const vehicleParamsSchema = z.object({
  id: z.string().transform(Number),
});

// Routes
router.get(
  "/:id",
  authenticateToken,
  validateParams(vehicleParamsSchema),
  getVehicle
);

router.post(
  "/",
  authenticateToken,
  requireManager,
  validateBody(createVehicleSchema),
  createVehicle
);

router.put(
  "/:id",
  authenticateToken,
  requireManager,
  validateParams(vehicleParamsSchema),
  validateBody(updateVehicleSchema),
  updateVehicle
);

router.delete(
  "/:id",
  authenticateToken,
  requireManager,
  validateParams(vehicleParamsSchema),
  deleteVehicle
);

export default router;