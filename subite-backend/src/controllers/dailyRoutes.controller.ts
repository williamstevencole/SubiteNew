import { Request, Response } from "express";
import { DailyRoute, Vehicle, User } from "../database/database.js";
import { logger } from "../utils/logger.js";
import { createCursorPaginatedResponse, getCursorWhereClause } from "../services/pagination.js";
import { UserRole } from "../types/auth.js";


export const getDailyRoutes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;
    const { limit = 20, cursor, status, date } = req.query as any;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    let whereClause: any = {
      companyId: auth.companyId,
      ...getCursorWhereClause(cursor),
    };

    // Role-based filtering
    if (auth.role === UserRole.DRIVER) {
      whereClause.driverId = auth.userId;
    }

    // Apply filters
    if (status) {
      whereClause.status = status;
    }
    if (date) {
      whereClause.date = new Date(date);
    }

    const dailyRoutes = await DailyRoute.findAll({
      where: whereClause,
      attributes: ['id', 'createdAt', 'updatedAt', 'date', 'status', 'lastLat', 'lastLng', 'lastPositionAt'],
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'name', 'plate']
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['id', 'DESC']],
      limit: parseInt(limit),
    });

    const response = createCursorPaginatedResponse(
      dailyRoutes,
      parseInt(limit),
      (route) => (route as any).id
    );

    logger.info("Daily routes retrieved", {
      userId: auth.userId,
      role: auth.role,
      count: dailyRoutes.length,
    });

    res.json(response);
  } catch (error) {
    logger.error("Error retrieving daily routes", { error, userId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// GET /daily-routes/:id - Get daily route details
export const getDailyRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const routeId = parseInt(req.params.id!);
    const { auth } = req;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    let whereClause: any = {
      id: routeId,
      companyId: auth.companyId,
    };

    // Role-based filtering
    if (auth.role === UserRole.DRIVER) {
      whereClause.driverId = auth.userId;
    }

    const dailyRoute = await DailyRoute.findOne({
      where: whereClause,
      attributes: ['id', 'createdAt', 'updatedAt', 'date', 'status', 'lastLat', 'lastLng', 'lastPositionAt'],
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'name', 'plate']
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!dailyRoute) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Daily route not found" },
      });
      return;
    }

    logger.info("Daily route retrieved", {
      routeId,
      userId: auth.userId,
      role: auth.role,
    });

    res.json({ data: dailyRoute });
  } catch (error) {
    logger.error("Error retrieving daily route", { error, routeId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// POST /daily-routes - Create daily route (MANAGER only)
export const createDailyRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;
    const { date, vehicleId, driverId } = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Only managers can create daily routes" },
      });
      return;
    }

    if (!auth.companyId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Manager must be assigned to a company" },
      });
      return;
    }

    // Validate vehicle and driver belong to same company
    if (vehicleId) {
      const vehicle = await Vehicle.findOne({
        where: { id: vehicleId, companyId: auth.companyId },
      });
      if (!vehicle) {
        res.status(400).json({
          error: { code: "INVALID_VEHICLE", message: "Vehicle not found or not in same company" },
        });
        return;
      }
    }

    if (driverId) {
      const driver = await User.findOne({
        where: {
          id: driverId,
          companyId: auth.companyId,
          role: UserRole.DRIVER,
        },
      });
      if (!driver) {
        res.status(400).json({
          error: { code: "INVALID_DRIVER", message: "Driver not found or not in same company" },
        });
        return;
      }
    }

    // Note: DailyRoute requires companyScheduleId, not companyId
    // This endpoint needs to be updated to accept companyScheduleId from the request
    const dailyRoute = await DailyRoute.create({
      date: new Date(date),
      vehicleId,
      driverId,
      companyScheduleId: 1, // TODO: This should come from request body
      status: "PENDING",
    });

    const routeData = dailyRoute.get() as any;

    logger.info("Daily route created", {
      routeId: routeData.id,
      managerId: auth.userId,
      companyId: auth.companyId,
    });

    res.status(201).json({ data: dailyRoute });
  } catch (error) {
    logger.error("Error creating daily route", { error, managerId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// PUT /daily-routes/:id - Update daily route
export const updateDailyRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const routeId = parseInt(req.params.id!);
    const { auth } = req;
    const { status, lastLat, lastLng } = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    let whereClause: any = {
      id: routeId,
      companyId: auth.companyId,
    };

    // Role-based access
    if (auth.role === UserRole.DRIVER) {
      whereClause.driverId = auth.userId;
    } else if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Insufficient permissions" },
      });
      return;
    }

    const dailyRoute = await DailyRoute.findOne({ where: whereClause });

    if (!dailyRoute) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Daily route not found" },
      });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (lastLat !== undefined) updateData.lastLat = lastLat;
    if (lastLng !== undefined) updateData.lastLng = lastLng;
    if (lastLat !== undefined || lastLng !== undefined) {
      updateData.lastPositionAt = new Date();
    }

    await dailyRoute.update(updateData);

    logger.info("Daily route updated", {
      routeId,
      userId: auth.userId,
      role: auth.role,
    });

    res.json({ data: dailyRoute });
  } catch (error) {
    logger.error("Error updating daily route", { error, routeId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};
