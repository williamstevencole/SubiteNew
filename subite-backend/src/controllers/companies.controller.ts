import { Request, Response } from "express";
import { Company, Vehicle, User } from "../database/database.js";
import { logger } from "../utils/logger.js";
import { createCursorPaginatedResponse, getCursorWhereClause } from "../services/pagination.js";
import { UserRole } from "../types/auth.js";

// GET /companies/:id - Get company details (MANAGER only)
export const getCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id!);
    const { auth } = req;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER || auth.companyId !== companyId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Access denied" },
      });
      return;
    }

    const company = await Company.findByPk(companyId, {
      attributes: ['id', 'createdAt', 'updatedAt', 'name'],
    });

    if (!company) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Company not found" },
      });
      return;
    }

    // Get counts
    const userCount = await User.count({ where: { companyId } });
    const vehicleCount = await Vehicle.count({ where: { companyId } });

    // Add counts to response
    const companyWithCounts = {
      ...company.toJSON(),
      _count: {
        users: userCount,
        vehicles: vehicleCount,
      },
    };

    logger.info("Company retrieved", {
      companyId,
      userId: auth.userId,
    });

    res.json({ data: companyWithCounts });
  } catch (error) {
    logger.error("Error retrieving company", { error, companyId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// GET /companies/:id/vehicles - Get company vehicles with role-based filtering
export const getCompanyVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id!);
    const { auth } = req;
    const { limit = 20, cursor, active } = req.query as any;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.companyId !== companyId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Access denied" },
      });
      return;
    }

    let whereClause: any = {
      companyId,
      ...getCursorWhereClause(cursor),
    };

    // Role-based filtering
    if (auth.role === UserRole.DRIVER) {
      whereClause.driverId = auth.userId;
    } else if (auth.role === UserRole.PASSENGER) {
      whereClause.active = true;
    }

    // Apply active filter if provided
    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    const vehicles = await Vehicle.findAll({
      where: whereClause,
      attributes: ['id', 'createdAt', 'updatedAt', 'name', 'plate', 'active'],
      include: [{
        model: User,
        as: 'driver',
        attributes: ['id', 'name', 'email']
      }],
      order: [['id', 'DESC']],
      limit: parseInt(limit),
    });

    const response = createCursorPaginatedResponse(
      vehicles,
      parseInt(limit),
      (vehicle) => (vehicle as any).id
    );

    logger.info("Company vehicles retrieved", {
      companyId,
      userId: auth.userId,
      role: auth.role,
      count: vehicles.length,
    });

    res.json(response);
  } catch (error) {
    logger.error("Error retrieving company vehicles", { error, companyId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// POST /companies - Create company (MANAGER only)
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;
    const { name } = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Only managers can create companies" },
      });
      return;
    }

    const company = await Company.create({ name });
    const companyData = company.get() as any;

    logger.info("Company created", {
      companyId: companyData.id,
      managerId: auth.userId,
    });

    res.status(201).json({ data: company });
  } catch (error) {
    logger.error("Error creating company", { error, managerId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// PUT /companies/:id - Update company (MANAGER only)
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id!);
    const { auth } = req;
    const { name } = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER || auth.companyId !== companyId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Access denied" },
      });
      return;
    }

    const company = await Company.findByPk(companyId);
    if (!company) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Company not found" },
      });
      return;
    }

    await company.update({ name });

    logger.info("Company updated", {
      companyId,
      managerId: auth.userId,
    });

    res.json({ data: company });
  } catch (error) {
    logger.error("Error updating company", { error, companyId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};