import { Request, Response } from "express";
import { User, Company } from "../database/models/index.js";
import { logger } from "../utils/logger.js";
import { createCursorPaginatedResponse, getCursorWhereClause } from "../services/pagination.js";
import { UserRole } from "../types/auth.js";
import bcrypt from "bcrypt";

// GET /users/me - Get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const user = await User.findByPk(auth.userId, {
      attributes: ['id', 'createdAt', 'updatedAt', 'email', 'name', 'phone', 'role'],
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "User not found" },
      });
      return;
    }

    logger.info("Current user profile retrieved", {
      userId: auth.userId,
    });

    res.json({ data: user });
  } catch (error) {
    logger.error("Error retrieving current user", { error, userId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// GET /users - Get users list (MANAGER only, within same company)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;
    const { limit = 20, cursor, role } = req.query as any;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Only managers can list users" },
      });
      return;
    }

    if (!auth.companyId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "User must be assigned to a company" },
      });
      return;
    }

    let whereClause: any = {
      companyId: auth.companyId,
      ...getCursorWhereClause(cursor),
    };

    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'createdAt', 'updatedAt', 'email', 'name', 'phone', 'role'],
      order: [['id', 'DESC']],
      limit: parseInt(limit),
    });

    const response = createCursorPaginatedResponse(
      users,
      parseInt(limit),
      (user) => user.id
    );

    logger.info("Users list retrieved", {
      companyId: auth.companyId,
      managerId: auth.userId,
      count: users.length,
      roleFilter: role,
    });

    res.json(response);
  } catch (error) {
    logger.error("Error retrieving users", { error, managerId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// POST /users - Create user (MANAGER only)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;
    const { email, name, phone, role, password} = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Only managers can create users" },
      });
      return;
    }

    if (!auth.companyId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Manager must be assigned to a company" },
      });
      return;
    }

    const user = await User.create({
      email,
      name,
      phone,
      role,
      companyId: auth.companyId,
      password: await bcrypt.hash(password, 10),
    });

    logger.info("User created", {
      userId: user.id,
      managerId: auth.userId,
      companyId: auth.companyId,
    });

    res.status(201).json({ data: user });
  } catch (error) {
    logger.error("Error creating user", { error, managerId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// PUT /users/:id - Update user (MANAGER only, or self for basic fields)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;
    const userId = parseInt(req.params.id!);
    const { name, phone, role } = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "User not found" },
      });
      return;
    }

    // Check permissions
    const isOwnProfile = auth.userId === userId;
    const isManager = auth.role === UserRole.MANAGER;
    const isSameCompany = auth.companyId === user.companyId;

    if (!isOwnProfile && (!isManager || !isSameCompany)) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Insufficient permissions" },
      });
      return;
    }

    // Only managers can change roles
    const updateData: any = { name, phone };
    if (role && isManager) {
      updateData.role = role;
    }

    await user.update(updateData);

    logger.info("User updated", {
      userId,
      updatedBy: auth.userId,
      isOwnProfile,
    });

    res.json({ data: user });
  } catch (error) {
    logger.error("Error updating user", { error, userId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};
