import { Router } from "express";
import { z } from "zod";
import { login, register, getMe } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { UserRole } from "../types/auth.js";

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  companyId: z.number().optional(),
});

// Routes
router.post("/login", validateBody(loginSchema), login);
router.post("/register", validateBody(registerSchema), register);
router.get("/me", authenticateToken, getMe);

export default router;