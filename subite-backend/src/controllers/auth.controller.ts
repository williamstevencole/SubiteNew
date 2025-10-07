import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Company } from "../database/database.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";
import { UserRole } from "../types/auth.js";

// POST /auth/login - Login with email/password
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'passwordHash', 'role', 'companyId', 'name'],
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }]
    });

    logger.debug("User fetched from database", { user });

    const userData = user?.get() as any;

    if (!user || !userData.passwordHash) {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
      return;
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
      return;
    }

    // Generate JWT token
    logger.debug("User fields for JWT", {
      id: userData.id,
      role: userData.role,
      companyId: userData.companyId,
      email: userData.email
    });

    const token = jwt.sign(
      {
        sub: userData.id?.toString(),
        role: userData.role,
        companyId: userData.companyId ? userData.companyId.toString() : undefined,
        email: userData.email,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      data: {
        token,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          company: userData.company,
        },
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.stack || error.message : error;
    logger.error("Error during login", { error: errorMessage, email: req.body?.email });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// POST /auth/register
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

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email,
      name,
      phone,
      role: role || UserRole.PASSENGER,
      companyId,
      passwordHash: hashedPassword,
    });

    // Generate JWT token
    const newUserData = user.get() as any;
    const token = jwt.sign(
      {
        sub: newUserData.id.toString(),
        role: newUserData.role,
        companyId: newUserData.companyId?.toString(),
        email: newUserData.email,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "24h" }
    );

    logger.info("User registered successfully", {
      userId: newUserData.id,
      email: newUserData.email,
      role: newUserData.role,
    });

    res.status(201).json({
      data: {
        token,
        user: {
          id: newUserData.id,
          email: newUserData.email,
          name: newUserData.name,
          role: newUserData.role,
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
