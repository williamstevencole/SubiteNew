import { Router } from "express";
import { z } from "zod";
import {
  getDailyRoutes,
  getDailyRoute,
  createDailyRoute,
  updateDailyRoute,
} from "../controllers/dailyRoutes.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireManager, requireManagerOrDriver } from "../middleware/rbac.js";
import { validateBody, validateQuery, validateParams } from "../middleware/validation.js";

const router = Router();

// Validation schemas
const createDailyRouteSchema = z.object({
  date: z.string(),
  vehicleId: z.number().optional(),
  driverId: z.number().optional(),
});

const updateDailyRouteSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "FINISHED", "CANCELLED"]).optional(),
  lastLat: z.number().optional(),
  lastLng: z.number().optional(),
});

const getDailyRoutesQuerySchema = z.object({
  limit: z.coerce.number().default(20),
  cursor: z.coerce.number().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "FINISHED", "CANCELLED"]).optional(),
  date: z.string().optional(),
});

const dailyRouteParamsSchema = z.object({
  id: z.string().transform(Number),
});

// Ruta para manejar daily routes
router.get("/",authenticateToken,validateQuery(getDailyRoutesQuerySchema),getDailyRoutes);

router.get("/:id",authenticateToken,validateParams(dailyRouteParamsSchema),getDailyRoute);

router.post("/",authenticateToken,requireManager,validateBody(createDailyRouteSchema),createDailyRoute);

router.put(
  "/:id",
  authenticateToken,
  requireManagerOrDriver,
  validateParams(dailyRouteParamsSchema),
  validateBody(updateDailyRouteSchema),
  updateDailyRoute
);

export default router;
