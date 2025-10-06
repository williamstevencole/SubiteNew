import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, Company } from "../database/models/index.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";
import { UserRole } from "../types/auth.js";

// POST /auth/login - Login with email/password
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // For demo purposes, we'll use a simple password check
    // In production, you should hash passwords properly
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
      return;
    }

    // For demo, accept any password as "password123"
    // In production, use bcrypt.compare(password, user.hashedPassword)
    if (password !== "password123") {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.id.toString(),
        role: user.role,
        companyId: user.companyId?.toString(),
        email: user.email,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "24h" }
    );

    logger.info("User logged in successfully", {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          company: user.company,
        },
      },
    });
  } catch (error) {
    logger.error("Error during login", { error, email: req.body?.email });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// POST /auth/register - Register new user (for demo purposes)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, phone, role, companyId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        error: { code: "EMAIL_EXISTS", message: "Email already in use" },
      });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      name,
      phone,
      role: role || UserRole.PASSENGER,
      companyId,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.id.toString(),
        role: user.role,
        companyId: user.companyId?.toString(),
        email: user.email,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "24h" }
    );

    logger.info("User registered successfully", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error("Error during registration", { error, email: req.body?.email });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// GET /auth/me - Get current user info (requires authentication)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const user = await User.findByPk(auth.userId, {
      attributes: ['id', 'email', 'name', 'phone', 'role'],
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      res.status(404).json({
        error: { code: "USER_NOT_FOUND", message: "User not found" },
      });
      return;
    }

    res.json({ data: user });
  } catch (error) {
    logger.error("Error getting user info", { error, userId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};