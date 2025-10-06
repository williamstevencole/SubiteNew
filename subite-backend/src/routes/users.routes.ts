import { Router } from "express";
import { z } from "zod";
import {
  getCurrentUser,
  getUsers,
  createUser,
  updateUser,
} from "../controllers/users.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireManager } from "../middleware/rbac.js";
import { validateBody, validateQuery, validateParams } from "../middleware/validation.js";
import { UserRole } from "../types/auth.js";

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

const getUsersQuerySchema = z.object({
  limit: z.coerce.number().default(20),
  cursor: z.coerce.number().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

const userParamsSchema = z.object({
  id: z.string().transform(Number),
});

// Routes
router.get("/me", authenticateToken, getCurrentUser);

router.get(
  "/",
  authenticateToken,
  requireManager,
  validateQuery(getUsersQuerySchema),
  getUsers
);

router.post(
  "/",
  authenticateToken,
  requireManager,
  validateBody(createUserSchema),
  createUser
);

router.put(
  "/:id",
  authenticateToken,
  validateParams(userParamsSchema),
  validateBody(updateUserSchema),
  updateUser
);

export default router;